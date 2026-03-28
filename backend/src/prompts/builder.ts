import { DesignStyle } from '../models';

export interface PromptOptions {
  style: DesignStyle;
  roomType?: string;
  additionalInstructions?: string;
  isPreview?: boolean;
}

export function buildPreviewPrompt(style: DesignStyle, roomType?: string): string {
  const room = roomType || 'room';

  return [
    `Redesign this ${room} in ${style.displayName} style.`,
    `Use a color palette of: ${style.colorPalette.join(', ')}.`,
    `Furniture style: ${style.furnitureType}.`,
    `Lighting: ${style.lightingMood}.`,
    `Materials: ${style.materials.join(', ')}.`,
    `Camera perspective: ${style.cameraPerspective}.`,
    `Keep the original room geometry, dimensions, windows, and doors intact.`,
    `The result must be photorealistic, 4K quality, interior architectural render.`,
    `Professional interior design photography style.`,
    `Ensure consistent lighting and shadows.`,
    `Do not add any text, watermarks, or logos to the image.`,
  ].join('\n');
}

export function buildFinalPrompt(style: DesignStyle, roomType?: string, additionalInstructions?: string): string {
  const room = roomType || 'room';

  const base = [
    `Create a final high-resolution interior design render of this ${room} in ${style.displayName} style.`,
    ``,
    `COLOR PALETTE: ${style.colorPalette.join(', ')}`,
    `FURNITURE: ${style.furnitureType}`,
    `LIGHTING: ${style.lightingMood}`,
    `MATERIALS: ${style.materials.join(', ')}`,
    `PERSPECTIVE: ${style.cameraPerspective}`,
    ``,
    `REQUIREMENTS:`,
    `- Preserve the original room layout, walls, windows, ceiling height, and architectural features exactly.`,
    `- Apply the ${style.displayName} style consistently to all furniture, decor, lighting, and materials.`,
    `- Photorealistic quality, 4K resolution, professional architectural visualization.`,
    `- Natural, consistent lighting with proper shadows and reflections.`,
    `- Include appropriate decor items, plants, artwork fitting the style.`,
    `- Ensure the space looks livable and professionally designed.`,
    `- No text, watermarks, or logos.`,
    `- Magazine-quality interior photography.`,
  ];

  if (additionalInstructions) {
    base.push(``, `ADDITIONAL INSTRUCTIONS: ${additionalInstructions}`);
  }

  return base.join('\n');
}

export function buildMultiStylePreviewPrompt(styles: DesignStyle[], roomType?: string): string[] {
  return styles.map((style) => buildPreviewPrompt(style, roomType));
}
