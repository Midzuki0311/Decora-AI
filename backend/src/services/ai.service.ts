import logger from '../utils/logger';
import { config } from '../config';
import { MockProvider } from './ai/mock.provider';
import { HuggingFaceProvider } from './ai/huggingface.provider';
import { ReplicateProvider } from './ai/replicate.provider';
import { GeminiProvider } from './ai/gemini.provider';
import { FalProvider } from './ai/fal.provider';
import { AppError } from '../utils/errors';
import { AIProvider, DesignMode, DesignStyleInput, GenerationResult } from './ai/ai.provider.interface';

// Re-export types so controller doesn't need to change import paths
export type { DesignStyleInput, GenerationResult, DesignMode };

// ─── Provider types ───────────────────────────────────────────────────────────
export type ActiveProvider = 'mock' | 'fal' | 'huggingface' | 'replicate' | 'gemini';

// ─── Available Models Metadata ────────────────────────────────────────────────
export const availableModels = [
    {
        id: 'fal',
        name: 'Fal.ai (FLUX ControlNet)',
        description: 'BEST for keeping room structure. Very fast. Requires API key with $5 free credit.',
        isFree: true,
        recommended: true,
    },
    {
        id: 'gemini',
        name: 'Google Gemini 2.0 Flash',
        description: 'TRUE img2img. Keeps your room structure when redesigning! Free tier available.',
        isFree: true,
        recommended: true,
    },
    {
        id: 'huggingface',
        name: 'Hugging Face (Free)',
        description: 'Text-to-image only. Slower, but completely free.',
        isFree: true,
        recommended: false,
    },
    {
        id: 'replicate',
        name: 'Replicate (Paid)',
        description: 'High quality models, but costs 1 credit per generation.',
        isFree: false,
        recommended: false,
    },
    {
        id: 'mock',
        name: 'Mock (Demo)',
        description: 'Instant generation for testing UI without using credits.',
        isFree: true,
        recommended: false,
    }
];

// ─── Factory ──────────────────────────────────────────────────────────────────
export function getProvider(providerNameOverride?: string): AIProvider {
    const providerName = (providerNameOverride || config.activeAiProvider || 'mock').toLowerCase() as ActiveProvider;

    switch (providerName) {
        case 'gemini':
            return new GeminiProvider((config as any).gemini?.apiKey || '');
        case 'fal':
            return new FalProvider((config as any).fal?.apiKey || '');
        case 'huggingface':
            return new HuggingFaceProvider(config.huggingface.apiToken);
        case 'replicate':
            return new ReplicateProvider(config.replicate.apiToken);
        case 'mock':
            return new MockProvider();
        default:
            logger.warn(`[AIService] Unknown provider "${providerName}" — falling back to mock`);
            return new MockProvider();
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns true when the active provider is free (no credits charged).
 * mock and huggingface are free; only replicate costs a credit.
 */
export function isFreeProvider(providerNameOverride?: string): boolean {
    const active = (providerNameOverride || config.activeAiProvider || 'mock').toLowerCase();
    return active === 'mock' || active === 'huggingface' || active === 'gemini' || active === 'fal';
}

/**
 * Returns the active provider name for logging / response metadata.
 */
export function getActiveProvider(providerNameOverride?: string): string {
    return (providerNameOverride || config.activeAiProvider || 'mock').toLowerCase();
}

/**
 * Generate a single design (preview or final) using the active AI provider.
 */
export async function generateDesign(
    mode: DesignMode,
    imageUrl: string,
    style: DesignStyleInput,
    roomType?: string,
    additionalInstructions?: string,
    customPrompt?: string,
    modelName?: string,
): Promise<GenerationResult> {
    const p = getProvider(modelName);
    return p.generateDesign(mode, imageUrl, style, roomType, additionalInstructions, customPrompt);
}

/**
 * Generate previews for multiple styles sequentially.
 * Adds a 3-second delay between styles to respect rate limits.
 */
export async function generateMultipleDesignPreviews(
    imageUrl: string,
    styles: DesignStyleInput[],
    roomType?: string,
    customPrompt?: string,
    modelName?: string,
): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    for (const style of styles) {
        try {
            const result = await generateDesign('preview', imageUrl, style, roomType, undefined, customPrompt, modelName);
            results.push(result);

            if (styles.length > 1) {
                await new Promise((r) => setTimeout(r, 3000));
            }
        } catch (error: any) {
            // Re-throw billing errors immediately — no point retrying other styles
            const { AIBillingError } = await import('./replicate.service');
            if (error instanceof AIBillingError) throw error;
            logger.error(`[AIService] Preview failed for style "${style.name}": ${error.message}`);
            // Continue with remaining styles
        }
    }

    return results;
}

/**
 * Extract room details from an image.
 */
export async function analyzeRoom(imageUrl: string): Promise<any> {
    const provider = getProvider('gemini'); // Always use Gemini for analysis
    if (provider instanceof GeminiProvider) {
        return provider.analyzeRoom(imageUrl);
    }
    throw new AppError('Gemini provider is required for room analysis.', 500);
}

/**
 * Generate a descriptive prompt for a room and style.
 */
export async function suggestPrompt(roomType: string, styleDetails: any): Promise<string> {
   const provider = getProvider('gemini'); // Always use Gemini for prompt gen
   if (provider instanceof GeminiProvider) {
       return provider.suggestPrompt(roomType, styleDetails);
   }
   throw new AppError('Gemini provider is required for prompt generation.', 500);
}

// ─── Legacy compatibility exports ─────────────────────────────────────────────
// Keep these so any file that imported the old function names still works
export const generateDesignPreview = (
    imageUrl: string,
    style: DesignStyleInput,
    roomType?: string,
    customPrompt?: string,
    modelName?: string,
) => generateDesign('preview', imageUrl, style, roomType, undefined, customPrompt, modelName);

export const generateDesignFinal = (
    imageUrl: string,
    style: DesignStyleInput,
    roomType?: string,
    additionalInstructions?: string,
    customPrompt?: string,
    modelName?: string,
) => generateDesign('final', imageUrl, style, roomType, additionalInstructions, customPrompt, modelName);
