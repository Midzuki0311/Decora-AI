import { GoogleGenAI } from '@google/genai';
import logger from '../../utils/logger';
import { uploadUrlToCloudinary } from '../cloudinary.service';
import { AppError } from '../../utils/errors';
import { AIBillingError } from '../replicate.service';
import { AIProvider, DesignMode, DesignStyleInput, GenerationResult } from './ai.provider.interface';

// ─── Model ────────────────────────────────────────────────────────────────────
// gemini-3.1-flash-image-preview supports:
//   • Image input  (original room photo as base64)
//   • Text prompt  (style instruction)
//   • Image output (edited version — same room, new style)
// This is TRUE img2img: walls, floor, ceiling stay in place.
// Docs: https://ai.google.dev/gemini-api/docs/image-generation
const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';

// ─── Instruction Builder ──────────────────────────────────────────────────────
function buildInstruction(
    style: DesignStyleInput,
    roomType?: string,
    customPrompt?: string,
    mode: DesignMode = 'preview',
): string {
    const room = roomType || 'room';
    const quality = mode === 'final'
        ? 'Ultra high resolution, professional architectural render.'
        : 'Photorealistic 4K quality, architectural visualization.';

    if (customPrompt) {
        return `Redesign this ${room}: ${customPrompt}. Style: ${style.displayName}. Keep the same room layout and structure. ${quality}`;
    }

    return [
        `Redesign this ${room} photo in ${style.displayName} interior design style.`,
        `Color scheme: ${style.colorPalette.slice(0, 4).join(', ')}.`,
        `Furniture: ${style.furnitureType}. Lighting: ${style.lightingMood}.`,
        `Materials: ${style.materials.slice(0, 3).join(', ')}.`,
        `IMPORTANT: Keep the exact same perspective, camera angle, walls, windows, doors, ceiling, and floor position.`,
        `Only change furniture, decor, wall colors, flooring material, and lighting fixtures.`,
        quality,
    ].join(' ');
}

// ─── Gemini Provider ──────────────────────────────────────────────────────────
export class GeminiProvider implements AIProvider {
    private readonly ai: GoogleGenAI;

    constructor(apiKey: string) {
        if (!apiKey) {
            logger.warn('[GeminiProvider] GEMINI_API_KEY is not set — API calls will fail with 403.');
        }
        this.ai = new GoogleGenAI({ apiKey });
    }

    async analyzeRoom(imageUrl: string): Promise<any> {
        let imageBase64: string;
        let imageMime: string;
        try {
            const imgResp = await fetch(imageUrl);
            if (!imgResp.ok) throw new Error(`HTTP ${imgResp.status}`);
            const buffer = Buffer.from(await imgResp.arrayBuffer());
            imageMime = (imgResp.headers.get('content-type') || 'image/jpeg').split(';')[0];
            imageBase64 = buffer.toString('base64');
        } catch (err: any) {
            throw new AppError('Could not download source image for analysis.', 500);
        }

        const prompt = `Analyze this interior room image. Respond ONLY with a valid JSON object matching this schema:
{
  "roomType": "string (e.g. living room, bedroom, kitchen)",
  "dimensions": "string (estimated size, e.g. '15x20 ft' or 'Medium')",
  "architecturalFeatures": ["string array of features like 'large windows', 'hardwood floors', 'vaulted ceiling'"],
  "currentStyle": "string (best guess at current design style)",
  "lighting": "string (description of natural and artificial light)",
  "suggestions": ["string array of 3 quick design tips"]
}
Do not include any markdown formatting like \`\`\`json. Just output the raw JSON string.`;

        try {
            // Using flash-8b for faster text/vision tasks if available, otherwise fallback to flash
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: imageMime,
                            data: imageBase64,
                        },
                    },
                ],
            });
            const text = response?.text || '';
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedText);
        } catch (err: any) {
            logger.warn(`[GeminiProvider] Analysis error: ${err.message}. Attempting Groq fallback...`);
            
            // Fallback to Groq Llama 3.2 Vision if Gemini rate limits
            const groqApiKey = (await import('../../config')).config.groq?.apiKey || process.env.GROQ_API_KEY;
            
            if (groqApiKey) {
                try {
                    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${groqApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'llama-3.2-11b-vision-preview',
                            messages: [
                                {
                                    role: 'user',
                                    content: [
                                        { type: 'text', text: prompt },
                                        { type: 'image_url', image_url: { url: imageUrl } }
                                    ]
                                }
                            ],
                            temperature: 0.2,
                        })
                    });
                    
                    if (groqResponse.ok) {
                        const groqData = await groqResponse.json() as any;
                        const text = groqData.choices[0]?.message?.content || '';
                        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                        logger.info(`[GeminiProvider] Successfully used Groq fallback for room analysis.`);
                        return JSON.parse(cleanedText);
                    } else {
                        const errorDetails = await groqResponse.text();
                         logger.error(`[GeminiProvider] Groq Analysis fallback failed: ${errorDetails}`);
                    }
                } catch (groqErr: any) {
                     logger.error(`[GeminiProvider] Groq fetch failed: ${groqErr.message}`);
                }
            }

            throw new AppError('Failed to analyze room image with AI. Rate Limit exceeded.', 500);
        }
    }

    async suggestPrompt(roomType: string, styleDetails: any): Promise<string> {
        const prompt = `You are an expert interior designer. Create a highly detailed, professional prompt for an AI image generator (like Midjourney or Stable Diffusion) to redesign a ${roomType}.
Target style: ${styleDetails.displayName}.
Style description: ${styleDetails.description}.
Color Palette: ${styleDetails.colorPalette.join(', ')}.
Materials: ${styleDetails.materials.join(', ')}.

The prompt should be written in English. Focus on lighting, materials, atmosphere, and camera quality (e.g., '8k resolution, photorealistic, architectural photography').
Return ONLY the prompt string, nothing else.`;

        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ text: prompt }],
            });
            return response?.text?.trim() || '';
        } catch (err: any) {
            logger.warn(`[GeminiProvider] Prompt generation error: ${err.message}. Attempting Groq fallback...`);
            
             // Fallback to standard Groq text model if Gemini rate limits
             const groqApiKey = (await import('../../config')).config.groq?.apiKey || process.env.GROQ_API_KEY;
            
             if (groqApiKey) {
                 try {
                     const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                         method: 'POST',
                         headers: {
                             'Authorization': `Bearer ${groqApiKey}`,
                             'Content-Type': 'application/json'
                         },
                         body: JSON.stringify({
                             model: 'llama-3.1-70b-versatile',
                             messages: [{ role: 'user', content: prompt }],
                             temperature: 0.7,
                         })
                     });
                     
                     if (groqResponse.ok) {
                         const groqData = await groqResponse.json() as any;
                         logger.info(`[GeminiProvider] Successfully used Groq fallback for prompt generation.`);
                         return groqData.choices[0]?.message?.content?.trim() || '';
                     } else {
                         const errorDetails = await groqResponse.text();
                         logger.error(`[GeminiProvider] Groq Prompt fallback failed: ${errorDetails}`);
                     }
                 } catch (groqErr: any) {
                      logger.error(`[GeminiProvider] Groq fetch failed: ${groqErr.message}`);
                 }
             }

            throw new AppError('Failed to generate prompt with AI. Both Gemini and Groq failed.', 500);
        }
    }

    async generateDesign(
        mode: DesignMode,
        imageUrl: string,
        style: DesignStyleInput,
        roomType?: string,
        additionalInstructions?: string,
        customPrompt?: string,
    ): Promise<GenerationResult> {
        const instruction = buildInstruction(style, roomType, customPrompt, mode);
        const fullInstruction = additionalInstructions
            ? `${instruction} Additional: ${additionalInstructions}`
            : instruction;

        // ── Download original room image ─────────────────────────────────────────
        let imageBase64: string;
        let imageMime: string;
        try {
            const imgResp = await fetch(imageUrl);
            if (!imgResp.ok) throw new Error(`HTTP ${imgResp.status}`);
            const buffer = Buffer.from(await imgResp.arrayBuffer());
            imageMime = (imgResp.headers.get('content-type') || 'image/jpeg').split(';')[0];
            imageBase64 = buffer.toString('base64');
            logger.info(`[GeminiProvider] Source image: ${buffer.length} bytes (${imageMime})`);
        } catch (err: any) {
            logger.error(`[GeminiProvider] Image download failed: ${err.message}`);
            throw new AppError('Could not download source image for Gemini processing.', 500);
        }

        logger.info(`[GeminiProvider] model=${GEMINI_MODEL} mode=${mode} style="${style.name}"`);
        logger.info(`[GeminiProvider] Instruction: ${fullInstruction.substring(0, 120)}...`);

        // ── Call Gemini img2img ───────────────────────────────────────────────────
        // Official format from: https://ai.google.dev/gemini-api/docs/image-generation
        let response: any;
        try {
            response = await this.ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: [
                    { text: fullInstruction },
                    {
                        inlineData: {
                            mimeType: imageMime,
                            data: imageBase64,
                        },
                    },
                ],
            });
        } catch (err: any) {
            logger.error(`[GeminiProvider] API error: ${err.message}`);

            if (err.message?.includes('API_KEY') || err.status === 401 || err.status === 403) {
                throw new AppError('Invalid or missing GEMINI_API_KEY. Check your .env file.', 500);
            }
            if (err.status === 429) {
                throw new AIBillingError('Gemini quota exceeded. Please wait and retry.');
            }
            if (err.status === 404) {
                throw new AppError(
                    `Gemini model "${GEMINI_MODEL}" not found. Check API key access.`,
                    500,
                );
            }
            throw new AppError(`Gemini API error: ${err.message}`, 500);
        }

        // ── Extract image from response ───────────────────────────────────────────
        const parts = response?.candidates?.[0]?.content?.parts ?? [];
        let imageData: string | null = null;
        let imageMimeOut = 'image/png';

        for (const part of parts) {
            if (part?.inlineData?.mimeType?.startsWith('image/')) {
                imageData = part.inlineData.data;
                imageMimeOut = part.inlineData.mimeType;
                break;
            }
        }

        if (!imageData) {
            const textParts = parts.filter((p: any) => p?.text).map((p: any) => p.text).join(' ');
            logger.error(`[GeminiProvider] No image in response. Text: ${textParts.substring(0, 200)}`);
            throw new AppError(
                'Gemini returned no image. Prompt may have been blocked. Try a different style description.',
                500,
            );
        }

        logger.info(`[GeminiProvider] ✓ Image generated (${imageMimeOut}), uploading...`);

        // ── Upload to Cloudinary ──────────────────────────────────────────────────
        const dataUri = `data:${imageMimeOut};base64,${imageData}`;
        const folder = mode === 'final' ? 'finals' : 'previews';
        const cloudResult = await uploadUrlToCloudinary(dataUri, `ai-interior/${folder}/${style.name}`);

        logger.info(`[GeminiProvider] ✓ Cloudinary: ${cloudResult.publicId}`);

        return {
            imageUrl: cloudResult.url,
            publicId: cloudResult.publicId,
            styleName: style.name,
            prompt: fullInstruction,
            modelUsed: `gemini/${GEMINI_MODEL}`,
        };
    }
}
