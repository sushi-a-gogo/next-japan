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
import { DreamBannerComponent } from "../dream-banner/dream-banner.component";

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatRippleModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, DreamBannerComponent],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent {
  params = { destination: 'Mt. Fuji', style: 'cartoon', tone: 'adventurous', attitude: 'excited' }; // Default params
  customText = '';
  generatedText = 'Baby go boom.';
  imageUrl = 'assets/images/orgs/tokyo.jpg';


  tones = ['adventurous', 'serene', 'nostalgic', 'magical', 'dreamy'];
  attitudes = ['excited', 'serene', 'curious', 'terrified'];
  palettes = ['earth tones', 'bright pastels', 'traditional Japanese colors like indigo, vermilion, etc.'];
  destinations = ['Mt. Fuji', 'Torii gate', 'cherry blossoms', 'trains', 'traditional buildings'];

  dreamEvent = signal<EventData | null>(null);
  private openAiService = inject(OpenAiService);

  generateContent() {
    this.dreamEvent.set({ eventId: 0, imageId: '', eventTitle: 'My Dream Event', description: '' });
    return;
    this.openAiService.generateContent(this.params, this.customText).subscribe({
      next: (response) => {
        this.generatedText = response.text;
        this.imageUrl = response.imageUrl;
        this.dreamEvent.update((prev) => ({ ...prev!, description: response.text }))
      },
      error: (err) => console.error('Error:', err),
    });
  }

}
