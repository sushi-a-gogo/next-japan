import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventData } from '@app/event/models/event-data.model';
import { OpenAiService } from '@app/services/open-ai.service';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { environment } from '@environments/environment';
import { DreamBannerComponent } from "../dream-banner/dream-banner.component";

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatRippleModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, DreamBannerComponent, LoadingSpinnerComponent],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent {
  busy = signal<boolean>(false);
  params = { destination: 'Mt. Fuji', style: 'cartoon', tone: 'adventurous', mood: 'excited' }; // Default params
  customText = '';
  generatedText = '';
  imageUrl = '';


  tones = ['adventurous', 'serene', 'nostalgic', 'magical', 'dreamy'];
  moods = ['excited', 'serene', 'curious', 'terrified'];
  palettes = ['earth tones', 'bright pastels', 'traditional Japanese colors like indigo, vermilion, etc.'];
  destinations = ['Mt. Fuji', 'Hakuba Valley', "Himeji Castle", 'Kyoto', 'Tokyo', 'Yokohama'];

  dreamEvent = signal<EventData | null>({ eventId: 0, imageId: '', eventTitle: 'My Dream Event', description: '' });
  private openAiService = inject(OpenAiService);

  generateContent() {
    this.busy.set(true);
    this.generatedText = '';
    return;
    // setTimeout(() => {
    //   this.busy.set(false);
    //   this.imageUrl = 'assets/images/orgs/tokyo.jpg';
    //   this.dreamEvent.set({ eventId: 0, imageId: '', eventTitle: 'My Dream Event', description: '' });
    // }, 1000);
    //return;

    //In the heart of Japan, where the mountains whisper ancient secrets and the cherry blossoms dance in the gentle breeze, lies a world waiting to be discovered by train. These locomotives, not mere machines, but gentle giants of iron and steam, glide gracefully through the landscape, weaving a tapestry of memories and dreams. Imagine embarking on a journey where each station is a gateway to a different realm, much like stepping into a Studio Ghibli film. The train whistles softly, echoing the calls of distant spirits, as it winds through mist-laden valleys and over bridges suspended above crystalline rivers. Outside your window, rice paddies stretch like green quilts, and forests of cedar and pine stand like silent sentinels, guardians of time's passage.



    const params = {
      ...this.params,
      style: this.params.style === 'cartoon' ? 'Studio Ghibli' : this.params.style
    };
    this.openAiService.generateContent(params, this.customText).subscribe({
      next: (response) => {
        this.generatedText = response.text;
        this.imageUrl = `${environment.apiUri}/${response.imageUrl}`;
        this.dreamEvent.update((prev) => ({ ...prev!, description: response.text }))
        this.busy.set(false);
      },
      error: (err) => console.error('Error:', err),
    });
  }

}
