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
  destinations = ['Kinkaku-ji', 'Mt. Fuji', 'Hakuba Valley', "Himeji Castle", 'Kyoto', 'Tokyo', 'Yokohama', 'Yonaha Maehama Beach'];

  dreamEvent = signal<EventData | null>(null);

  generateContent() {
    this.dreamEvent.set(null);
    this.busy.set(true);
    this.error.set(null);
    //return;
    // setTimeout(() => {
    //   this.busy.set(false);
    //   this.imageUrl = 'assets/images/orgs/tokyo.jpg';
    //   this.dreamEvent.set({ eventId: 0, image: { id: '', width: 1024, height: 1024 }, eventTitle: 'My Dream Event', description: '' });
    // }, 1000);
    //return;

    //In the heart of Japan, where the mountains whisper ancient secrets and the cherry blossoms dance in the gentle breeze, lies a world waiting to be discovered by train. These locomotives, not mere machines, but gentle giants of iron and steam, glide gracefully through the landscape, weaving a tapestry of memories and dreams. Imagine embarking on a journey where each station is a gateway to a different realm, much like stepping into a Studio Ghibli film. The train whistles softly, echoing the calls of distant spirits, as it winds through mist-laden valleys and over bridges suspended above crystalline rivers. Outside your window, rice paddies stretch like green quilts, and forests of cedar and pine stand like silent sentinels, guardians of time's passage.



    this.openAiService.generateContent(this.params, this.customText).subscribe({
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
