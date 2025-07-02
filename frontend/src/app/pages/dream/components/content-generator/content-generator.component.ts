import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventData } from '@app/pages/event/models/event-data.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ImageService } from '@app/services/image.service';
import { OpenAiService } from '@app/services/open-ai.service';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { DreamBannerComponent } from "../dream-banner/dream-banner.component";

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatRippleModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, DreamBannerComponent, LoadingSpinnerComponent],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent {
  private auth = inject(AuthMockService);
  private openAiService = inject(OpenAiService);
  private imageService = inject(ImageService);

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
  dreamEvent = signal<EventData | null>(null);

  disabled = computed(() => !this.auth.isAuthenticated())

  generateContent() {
    this.dreamEvent.set(null);
    this.busy.set(true);
    this.error.set(null);

    this.openAiService.generateContent(this.params, this.customText || 'happy', this.aiProvider).subscribe({
      next: (aiEvent) => {
        const event: EventData = {
          eventId: 0,
          ...aiEvent,
        }
        this.dreamEvent.set(event)
      },
      error: (e) => {
        this.error.set(e.message);
        this.busy.set(false);
      },
      complete: () => this.busy.set(false)
    });
  }

}
