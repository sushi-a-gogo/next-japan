import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { OpenAiService } from '@app/services/open-ai.service';
import { DreamBannerComponent } from "../dream-banner/dream-banner.component";

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatRippleModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, DreamBannerComponent],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent {
  private auth = inject(AuthMockService);
  private aiService = inject(OpenAiService);
  private destroyRef = inject(DestroyRef);

  busy = signal<boolean>(false);
  error = signal<string | null>(null);

  aiProvider: 'OpenAI' | 'Grok' = 'OpenAI'
  customText = '';

  tones = ['adventurous', 'serene', 'nostalgic', 'magical', 'dreamy', 'festive', 'rustic', 'exotic'];
  moods = ['excited', 'serene', 'curious', 'joyful', 'peaceful', 'inspired', 'terrified'];
  seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'Monsoon', 'Cherry Blossom', 'Maple Season'];
  destinations = [
    'Kinkaku-ji',
    'Hakuba Valley',
    'Himeji Castle',
    'Hokkaido',
    'Kyoto',
    'Mt. Fuji',
    'Nara',
    'Okinawa',
    'Shirakawa-go',
    'Tokyo',
    'Yokohama',
    'Yonaha Maehama Beach',
  ];
  activities = [
    'Cookout', 'Festival', 'Hiking', 'Cultural Tour', 'Skiing', 'Hot Spring Soak', 'Boat Ride'
  ];
  groupSizes = ['Solo', 'Small Group (2-5)', 'Family (6-10)', 'Large Group (10+)'];
  timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];

  params = {
    destination: this.destinations[0],
    tone: this.tones[0],
    mood: this.moods[0],
    season: this.seasons[0],
    activity: this.activities[0],
    groupSize: this.groupSizes[0],
    timeOfDay: this.timesOfDay[0],
  }; // Default params

  aiProviders = ['OpenAI', 'Grok'];
  dreamEvent = signal<AiEvent | null>(null);

  disabled = computed(() => !this.auth.isAuthenticated())
  saveEnabled = false;

  generateContent() {
    this.error.set(null);
    this.busy.set(true);

    this.aiService.generateContent$(this.params, this.customText || 'happy', this.aiProvider).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (aiEvent) => {
        this.dreamEvent.set(aiEvent)
      },
      error: (e) => {
        this.error.set(e.message);
        this.busy.set(false);
      },
      complete: () => this.busy.set(false)
    });
  }

  reset() {
    this.dreamEvent.set(null);
  }

  saveEvent() {
    this.aiService.saveEvent$(this.dreamEvent()!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      console.log('Saved:', res.data);
      this.dreamEvent.set(res.data); // Update with Cloudflare URL
    });

  }

}
