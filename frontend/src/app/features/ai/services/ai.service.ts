import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { ImageService } from '@app/core/services/image.service';
import { AiEvent } from '@app/features/ai/models/ai-event.model';
import { AiPromptParams } from '@app/features/ai/models/ai-prompt-params.model';
import { catchError, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private uri = 'api/ai';
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);
  private imageService = inject(ImageService);

  private promptParamsSignal = signal<AiPromptParams | null>(null)
  promptParams = this.promptParamsSignal.asReadonly();

  private aiEventSignal = signal<AiEvent | null>(null)
  aiEvent = this.aiEventSignal.asReadonly();

  generateHaiku$() {
    return this.apiService.get<string>(`${this.uri}/generate-haiku`).pipe(
      catchError((e) => this.errorService.handleError(e, 'Error fetching result from AI', true))
    )
  }

  clearPrompt() {
    this.promptParamsSignal.set(null);
  }

  generateContent$(params: AiPromptParams) {
    //return this.generateMock$();
    this.promptParamsSignal.set(params);
    return this.apiService.post<AiEvent>(`${this.uri}/generate-content`, {
      promptParams: params
    }).pipe(
      tap((res) => this.aiEventSignal.set(res.data)),
      catchError((e) => this.errorService.handleError(e, 'Error fetching result from Open AI', true))
    );
  }

  private generateMock$() {
    const mockEvent: AiEvent = {
      description: "Embark on a thrilling morning adventure in the misty mountains of Shirakawa-go during the monsoon season, where the rain unveils a hidden romance in the heart of Japan's ancient villages.",
      fullDescription: "Embark on a thrilling morning adventure in the misty mountains of Shirakawa-go during the monsoon season, where the rain unveils a hidden romance in the heart of Japan's ancient villages. Our small group of 2-5 explorers will delve into a cultural tour titled 'Secret Love,' uncovering the untold stories of love and longing etched into the thatched roofs of gassho-zukuri farmhouses. As raindrops dance on the lush greenery, we'll wander through narrow, glistening paths, discovering sacred shrines and local legends whispered by the wind. Feel the excitement as you sip warm tea with villagers, learning their timeless traditions while the monsoon weaves a magical veil around us. This is not just a tour; it’s a journey into the soul of Shirakawa-go, where every rain-soaked step reveals a piece of a secret love story waiting to be told. Join us for an unforgettable day of mystery and connection in a world washed anew by the rains!",
      eventTitle: "Secret Love Monsoon Quest",
      image: {
        id: "yokohama.png",
        cloudflareImageId: "78e603ed-b1ab-40db-c402-c902d939d900",
        width: 1792,
        height: 1024
      },
      imageUrl: "https://api.cloudflare.com/client/v4/accounts/06aa7348a14cc5bca05c8476b5617d53/images/v1/7368fce6-6095-49e7-97bb-df3ba1390400",
      aiProvider: "Grok",
      prompt: {
        text: "Generate a raw JSON object describing a day long special event in Japan based on these parameters:\n  {\"destination\":\"Shirakawa-go\",\"tone\":\"adventurous\",\"mood\":\"excited\",\"season\":\"Monsoon\",\"activity\":\"Cultural Tour\",\"groupSize\":\"Small Group (2-5)\",\"timeOfDay\":\"Morning\"}.\n  User input: Secret Love.\n  The JSON object must include these properties:\n      'description': a creative text narrative (max 200 words),\n      'eventTitle': a concise title inspired by the description (3-5 words).\n  Return only the raw JSON object, no additional text.\n  Do not include Markdown, code blocks, or extra text—output valid JSON only.\n  Output should look like: {'description': 'text...', 'eventTitle': 'title...'}.",
        image: "Create an anime-style digital painting in a cel-shaded, anime style,\n  using a color palette of warm glowing tones together with bright pastels,\n  and a theme inspired by Studio Ghibli movies, 'Secret Love' and these parameters: {\"destination\":\"Shirakawa-go\",\"tone\":\"adventurous\",\"mood\":\"excited\",\"season\":\"Monsoon\",\"activity\":\"Cultural Tour\",\"groupSize\":\"Small Group (2-5)\",\"timeOfDay\":\"Morning\"}.\n  The image should be family-friendly, non-violent, non-offensive and suitable for all audiences,\n  adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.\n  Keep focus on the landscape and mood; characters should feel like a natural part of the scene.\n  Avoid close-up or foreground characters.\n  The image should not contain any text or symbols."
      }
    };
    const img = this.imageService.resizeImage(mockEvent.image, mockEvent.image.width, mockEvent.image.height);
    mockEvent.imageUrl = img.src;
    this.aiEventSignal.set(mockEvent);
    return of(mockEvent).pipe(delay(1000));
  }

}
