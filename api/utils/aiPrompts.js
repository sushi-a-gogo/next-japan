export const haikuPrompt = `Generate a haiku in English that uniquely describes 'Next Japan'
- a Japanese vacation event planning website.
  Each line must start with a completely different, randomly chosen Unicode emoji embodying any aspect of
  Japanese culture, travel, or mystery (no examples provided).
  Explore a bold, unpredictable theme (e.g., cyberpunk Osaka, ancient tea rituals, haunted Aomori forests, futuristic Hokkaido farms),
  explicitly avoiding any repeated imagery, themes, or emojis from past outputs.
  Randomly switch between poetic styles (e.g., haiku with haibun flair, free-verse twist, or mythic tone) and perspectives
  (e.g., a lost tourist, a wandering fox spirit, a futuristic AI guide).
  Ensure the haiku is vibrant, evocative, and captures the diverse magic of Japanese travel.
  If you want, provide a brief explanation (explanation only, 25 words or less, and do NOT label it as an 'explanation')
  of the haiku's meaning - but this is optional.`;

export function eventDescriptionPrompt(promptParams, customText) {
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

export function customImagePrompt(promptParams, customText) {
  return `Create a digital painting using a cel-shaded
anime illustration style with a whimsical, hand-painted look.
Bright colors, gentle lighting, expressive characters,
stylized anime proportions,
slightly oversized eyes,
simplified facial features,
soft linework,
hand-painted background look,
rich but soft color gradients.

The image should depict a restaurant with a mid-century modern look and a theme inspired by '${customText}'

Do not use:
- realistic photography
- vintage or historical illustration styles
- muted sepia tones
- early 20th century art styles
- western editorial illustration
- text or symbols.`;
}

export function eventImagePrompt(promptParams, customText) {
  return `Create a digital painting using a cel-shaded
anime illustration style with a whimsical, hand-painted look.
Soft pastel colors, gentle lighting, expressive characters,
lush natural environments, warm and nostalgic atmosphere,
and a theme inspired by '${customText}' and these parameters: ${JSON.stringify(
    promptParams,
  )},
stylized anime proportions,
slightly oversized eyes,
simplified facial features,
soft linework,
no hyper-detailed textures,
dense foliage,
layered clouds,
hand-painted background look,
rich but soft color gradients.



The image should be family-friendly, non-violent, non-offensive and suitable for all audiences,
adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.
Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
Avoid close-up or foreground characters.
Do not use:
- realistic photography
- vintage or historical illustration styles
- muted sepia tones
- early 20th century art styles
- western editorial illustration
- text or symbols.`;
}

export function grokEventImagePrompt(promptParams, customText) {
  return `Generate a digital painting, using warm glowing tones and bright pastels,
with no text, family-friendly, high resolution.
The theme should be inspired by Studio Ghibli movies, '${customText}', and these parameters: ${JSON.stringify(
    promptParams,
  )}.
The image should have a cel-shaded, anime look-think Speed Racer.
The image should have the appearance of a Japanese animated movie.
Keep focus on the landscape and mood; characters should feel like a natural part of the scene.
Characters should be depicted in anime style and should take up only a small portion of the image.
The image should not contain any text or symbols.`;
}

export function ghibliStylePrompt({
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

export function umamiImagePrompt(customText) {
  return `Create an image using a cel-shaded
anime illustration style depicting a menu item for a
Japanese-Inspired Gourmet Pizza restaurant.

This is the menu item - '${customText}'

The image should be family-friendly, non-violent, non-offensive and suitable for all audiences,
adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.
The image should be rendered in an anime art style. It should not be photo-realistic`;
}
