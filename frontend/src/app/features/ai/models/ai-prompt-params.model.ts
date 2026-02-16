export interface AiPromptParams {
  destination: string;
  tone: string;
  mood: string;
  season: string;
  activity: string;
  groupSize: string;
  timeOfDay: string;
  aiProvider: 'OpenAI' | 'Grok';
  customText?: string;
}
