import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { environment } from '@environments/environment';
import { catchError, Observable, tap } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private uri = `${environment.apiUrl}/api/ai`;
  private errorService = inject(ErrorService);

  private aiEventSignal = signal<AiEvent | null>(null)
  aiEvent = this.aiEventSignal.asReadonly();

  constructor(private http: HttpClient) { }

  mockEvent: AiEvent = {
    description: "Embark on a thrilling morning adventure in the misty mountains of Shirakawa-go during the monsoon season, where the rain unveils a hidden romance in the heart of Japan's ancient villages.",
    fullDescription: "Embark on a thrilling morning adventure in the misty mountains of Shirakawa-go during the monsoon season, where the rain unveils a hidden romance in the heart of Japan's ancient villages. Our small group of 2-5 explorers will delve into a cultural tour titled 'Secret Love,' uncovering the untold stories of love and longing etched into the thatched roofs of gassho-zukuri farmhouses. As raindrops dance on the lush greenery, we'll wander through narrow, glistening paths, discovering sacred shrines and local legends whispered by the wind. Feel the excitement as you sip warm tea with villagers, learning their timeless traditions while the monsoon weaves a magical veil around us. This is not just a tour; it’s a journey into the soul of Shirakawa-go, where every rain-soaked step reveals a piece of a secret love story waiting to be told. Join us for an unforgettable day of mystery and connection in a world washed anew by the rains!",
    eventTitle: "Secret Love Monsoon Quest",
    image: {
      id: "yokohama.png",
      width: 1792,
      height: 1024
    },
    imageUrl: "https://imgen.x.ai/xai-imgen/xai-tmp-imgen-b0bd9572-90bf-40ae-acd6-caad6249e244.jpeg",
    aiProvider: "Grok",
    prompt: {
      text: "Generate a raw JSON object describing a day long special event in Japan based on these parameters:\n  {\"destination\":\"Shirakawa-go\",\"tone\":\"adventurous\",\"mood\":\"excited\",\"season\":\"Monsoon\",\"activity\":\"Cultural Tour\",\"groupSize\":\"Small Group (2-5)\",\"timeOfDay\":\"Morning\"}.\n  User input: Secret Love.\n  The JSON object must include these properties:\n      'description': a creative text narrative (max 200 words),\n      'eventTitle': a concise title inspired by the description (3-5 words).\n  Return only the raw JSON object, no additional text.\n  Do not include Markdown, code blocks, or extra text—output valid JSON only.\n  Output should look like: {'description': 'text...', 'eventTitle': 'title...'}.",
      image: "Create an anime-style digital painting in a cel-shaded, anime style,\n  using a color palette of warm glowing tones together with bright pastels,\n  and a theme inspired by Studio Ghibli movies, 'Secret Love' and these parameters: {\"destination\":\"Shirakawa-go\",\"tone\":\"adventurous\",\"mood\":\"excited\",\"season\":\"Monsoon\",\"activity\":\"Cultural Tour\",\"groupSize\":\"Small Group (2-5)\",\"timeOfDay\":\"Morning\"}.\n  The image should be family-friendly, non-violent, non-offensive and suitable for all audiences,\n  adhering to strict content moderation guidelines. Avoid nudity, gore, hate symbols, or any inappropriate content.\n  Keep focus on the landscape and mood; characters should feel like a natural part of the scene.\n  Avoid close-up or foreground characters.\n  The image should not contain any text or symbols."
    }
  };

  generateContent$(params: any, text: string, aiProvider: 'OpenAI' | 'Grok'): Observable<AiEvent> {
    // this.aiEventSignal.set(this.mockEvent);
    // return of(this.mockEvent).pipe(delay(1000));
    return this.http.post<AiEvent>(`${this.uri}/generate-content`, {
      promptParams: params,
      customText: text,
      aiProvider
    }).pipe(
      debug(RxJsLoggingLevel.DEBUG, "AI:generateContent"),
      tap((event) => this.aiEventSignal.set(event)),
      catchError((e) => this.errorService.handleError(e, 'Error fetching result from Open AI', true))
    );
  }

  saveEvent$(event: AiEvent) {
    return this.http.post<AiEvent>(`${this.uri}/save`, event).pipe(
      debug(RxJsLoggingLevel.DEBUG, "AI:saveEvent"),
      catchError((e) => this.errorService.handleError(e, 'Error saving event', true))
    );
  }
}
