import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventData } from '@app/event/models/event-data.model';
import { ImageService } from '@app/services/image.service';
import { OpenAiService } from '@app/services/open-ai.service';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { DreamBannerComponent } from "../dream-banner/dream-banner.component";

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatRippleModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, DreamBannerComponent, LoadingSpinnerComponent],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent {
  private openAiService = inject(OpenAiService);
  private imageService = inject(ImageService);

  busy = signal<boolean>(false);
  error = signal<string | null>(null);

  params = { destination: 'Mt. Fuji', style: 'cartoon', tone: 'adventurous', mood: 'excited', palette: 'warm glowing tones together with bright pastels' }; // Default params
  customText = '';
  storyBookBackground = this.imageService.backgroundImageUrl('storybook.png');


  tones = ['adventurous', 'serene', 'nostalgic', 'magical', 'dreamy'];
  moods = ['excited', 'serene', 'curious', 'terrified'];
  palettes = ['warm earth tones', 'bright pastels', 'traditional Japanese colors like indigo, vermilion, etc.'];
  destinations = ['Kinkaku-ji', 'Hakuba Valley', "Himeji Castle", 'Kyoto', 'Mt. Fuji', 'Tokyo', 'Yokohama', 'Yonaha Maehama Beach'];

  dreamEvent = signal<EventData | null>(null);

  generateContent() {
    this.dreamEvent.set(null);
    this.busy.set(true);
    this.error.set(null);

    this.openAiService.generateContent(this.params, this.customText || 'happy').subscribe({
      next: (aiEvent) => {
        const event: EventData = {
          eventId: 0,
          eventTitle: 'My Dream Event',
          image: aiEvent.image,
          description: aiEvent.text,

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
