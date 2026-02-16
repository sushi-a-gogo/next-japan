import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '@app/core/auth/auth.service';
import { AiEvent } from '@app/features/ai/models/ai-event.model';
import { AiPromptParams } from '@app/features/ai/models/ai-prompt-params.model';
import { AiService } from '@app/features/ai/services/ai.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { AiPromptsForm } from './ai-prompts.form';

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent implements OnInit {
  private auth = inject(AuthService);
  private aiService = inject(AiService);
  private destroyRef = inject(DestroyRef);

  promptForm?: FormGroup;
  eventCreating = output<boolean>();
  eventCreated = output<AiEvent | null>();

  busy = signal<boolean>(false);
  error = signal<string | null>(null);

  tones = ['adventurous', 'serene', 'nostalgic', 'magical', 'dreamy', 'festive', 'rustic', 'exotic', 'focused'];
  moods = ['excited', 'serene', 'curious', 'joyful', 'peaceful', 'inspired', 'terrified', 'fearless'];
  seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'Monsoon', 'Cherry Blossom', 'Maple Season'];
  destinations = [
    'Hakuba Valley',
    'Himeji Castle',
    'Hokkaido',
    'Kinkaku-ji',
    'Kyoto',
    'Mt. Fuji',
    'Nara',
    'Okinawa',
    'Shirakawa-go',
    'Tokyo',
    'Yokohama',
    'Yonaha Maehama Beach',
    'Corporate Office'
  ];
  activities = [
    'Explore', 'Local Experience', 'Cookout', 'Festival', 'Hiking', 'Cultural Tour', 'Skiing', 'Hot Spring Soak', 'Boat Ride', 'Unique Experience'
  ];
  groupSizes = ['Solo', 'Small Group (2-5)', 'Family (6-10)', 'Large Group (10+)'];
  timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];

  params: AiPromptParams =
    this.aiService.promptParams() ||
    {
      destination: this.destinations[0],
      tone: this.tones[0],
      mood: this.moods[0],
      season: this.seasons[0],
      activity: this.activities[0],
      groupSize: this.groupSizes[0],
      timeOfDay: this.timesOfDay[0],
      aiProvider: 'OpenAI'
    }; // Default params

  aiProviders = ['OpenAI', 'Grok'];
  disabled = computed(() => !this.auth.isAuthenticated())
  aiPrompts = this.buildForm();

  ngOnInit(): void {
  }

  generateContent() {
    if (this.aiPrompts.invalid) {
      return; // shouldn't happen - submit is disabled in this case
    }

    this.aiPrompts.disable();
    this.eventCreating.emit(true);

    this.error.set(null);
    this.busy.set(true);

    const requestParams: AiPromptParams = {
      ...this.aiPrompts.value as AiPromptParams
    };
    this.aiService.generateContent$(requestParams).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.eventCreated.emit(res.data);
        } else {
          this.eventCreated.emit(null);
        }
        this.aiPrompts.enable();
      },
      error: (e) => {
        this.eventCreated.emit(null);
        this.error.set(e.message);
        this.busy.set(false);
        this.aiPrompts.enable();
      },
      complete: () => this.busy.set(false)
    });
  }

  private buildForm(): FormGroup<AiPromptsForm> {
    return new FormGroup<AiPromptsForm>({
      destination: new FormControl<string | null>(this.params.destination, [Validators.required]),
      tone: new FormControl<string | null>(this.params.tone, [Validators.required]),
      mood: new FormControl<string | null>(this.params.mood, [Validators.required]),
      season: new FormControl<string | null>(this.params.season, [Validators.required]),
      activity: new FormControl<string | null>(this.params.activity, [Validators.required]),
      groupSize: new FormControl<string | null>(this.params.groupSize, [Validators.required]),
      timeOfDay: new FormControl<string | null>(this.params.timeOfDay, [Validators.required]),
      aiProvider: new FormControl<string | null>(this.params.aiProvider, [Validators.required]),
      customText: new FormControl<string | null>(this.params.customText || '')
    });
  }
}
