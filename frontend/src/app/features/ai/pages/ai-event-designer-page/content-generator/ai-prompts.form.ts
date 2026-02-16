import { FormControl } from "@angular/forms";

export interface AiPromptsForm {
  destination: FormControl<string | null>;
  tone: FormControl<string | null>;
  mood: FormControl<string | null>;
  season: FormControl<string | null>;
  activity: FormControl<string | null>;
  groupSize: FormControl<string | null>;
  timeOfDay: FormControl<string | null>;
  aiProvider: FormControl<string | null>;
  customText: FormControl<string | null>;
}
