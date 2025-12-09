import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AiPromptParams } from '@app/models/ai-prompt-params.model';
import { AiEvent } from '@app/models/event/ai-event.model';
import { AiService } from '@app/services/ai.service';
import { AuthService } from '@app/services/auth.service';
import { ButtonComponent } from '@app/shared/button/button.component';

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, ButtonComponent],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent implements OnInit {
  private auth = inject(AuthService);
  private aiService = inject(AiService);
  private destroyRef = inject(DestroyRef);

  promptForm?: FormGroup;
  eventCreating = output<boolean>();
  eventCreated = output<AiEvent>();

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

  ngOnInit(): void {
  }

  generateContent(promptForm: NgForm) {
    promptForm.form.disable();
    this.eventCreating.emit(true);

    this.error.set(null);
    this.busy.set(true);

    this.aiService.generateContent$(this.params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.eventCreated.emit(res.data);
        }
        promptForm.form.enable();
      },
      error: (e) => {
        this.error.set(e.message);
        this.busy.set(false);
        promptForm.form.enable();
      },
      complete: () => this.busy.set(false)
    });
  }
}
