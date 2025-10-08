export function createTextPrompt(promptParams, customText) {
  return `Generate a raw JSON object describing a day long special event in Japan based on these parameters:
${JSON.stringify(promptParams)}.
User input: ${customText}.
The JSON object must include these properties:
  'fullDescription': a creative text narrative (max 200 words),
  'description': a brief summary of the fullDescription value (max 30 words),
  'eventTitle': a concise title inspired by the description (3-5 words).
Return only the raw JSON object, no additional text.
Do not include Markdown, code blocks, or extra text—output valid JSON only.
Output should look like: { 'eventTitle': 'title...', 'description': 'text...', 'fullDescription': 'text...' }.`;
}

export function createImagePrompt(promptParams, customText) {
  return `Create an anime-style digital painting in a cel-shaded, anime style,
using a color palette of warm glowing tones together with bright pastels,
and a theme inspired by Studio Ghibli movies, '${customText}' and these parameters: ${JSON.stringify(
    promptParams
  )}.
The image should be family-friendly, non-violent, non-offensive and suitable for all audiences,
adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.
Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
Avoid close-up or foreground characters.
The image should not contain any text or symbols.`;
}

export function createGrokImagePrompt(promptParams, customText) {
  return `Ultra-wide 16:9 landscape ONLY, cinematic 1920x1080 horizontal panoramic frame,
ABSOLUTELY NO portrait or vertical composition.
Generate a digital painting, using warm glowing tones and bright pastels,
with no text, family-friendly, high resolution.
The theme should be inspired by Studio Ghibli movies, '${customText}', and these parameters: ${JSON.stringify(
    promptParams
  )}.
The image should have a cel-shaded, anime look-think Speed Racer.
The image should have the appearance of a Japanese animated movie.
Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
Characters should be depicted in anime style and should take up only a small portion of the image.
The image should not contain any text or symbols.`;
}

export function createGhibliStylePrompt({
  destination,
  tone,
  mood,
  subject = "a father and daughter",
}) {
  return `
An anime-style digital painting inspired by Studio Ghibli films like "My Neighbor Totoro" and "Kiki's Delivery Service".

Style:
- Hand-drawn, painterly textures.
- cel-shaded, anime-style
- Bright pastels and warm glowing light.
- Stylized backgrounds with whimsical fantasy elements.
- Soft shading, simple shapes, expressive character faces.

Scene:
- ${subject} at ${destination}, with a ${tone} and ${mood} feeling.
- Include iconic Japanese nature: cherry blossoms, rolling hills, clear sky, gentle breeze.

Characters:
- Similar character design to those seen in Studio Ghibli films.

Visual feel:
- Avoid realism or photorealistic textures.
- Avoid close-up or foreground characters
- Avoid harsh lighting or contrast
- Emulate animation cels or watercolor backgrounds.
- Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
`.trim();
}
