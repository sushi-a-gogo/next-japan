import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@core/services/api.service';
import { environment } from '@environments/environment';
import { AiEvent } from '@events/models/ai-event.model';
import { firstValueFrom } from 'rxjs';
import { AiService } from './ai.service';

describe('AI Service', () => {
  let service: AiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/ai`;
  const mockEvent: AiEvent =
  {
    eventTitle: "Magical Hokkaido",
    description: "Enchanting experience in Hokkaido's vibrant fall foliage.",
    fullDescription: "A joyful, enchanting experience in Hokkaido's vibrant fall foliage, where golden paths and cozy fireside moments create unforgettable memories.",
    image: {
      id: "event-image.png",
      cloudflareImageId: "id-1",
      width: 1792,
      height: 1024
    },
    imageUrl: 'https://mocked.image.url',
    aiProvider: "OpenAI",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AiService,
        ApiService,
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AiService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a haiku from the API with a valid response', async () => {
    const promise = firstValueFrom(service.generateHaiku$());

    const req = httpMock.expectOne(`${apiUrl}/generate-haiku`);
    req.flush({ data: 'A Next Japan themed haiku.' });

    const haiku = await promise;
    expect(haiku.data).toBe('A Next Japan themed haiku.');
  });


  it('should fetch an ai-generated event from the API', async () => {
    const aiProvider: "OpenAI" | "Grok" = "OpenAI";
    const params = {
      destination: '',
      tone: '',
      mood: '',
      season: '',
      activity: '',
      groupSize: '',
      timeOfDay: '',
      aiProvider
    };
    const promise = firstValueFrom(service.generateContent$(params));

    const req = httpMock.expectOne(`${apiUrl}/generate-content`);
    req.flush({ data: mockEvent });

    const aiEvent = await promise;
    expect(aiEvent.data?.eventTitle).toBe('Magical Hokkaido');
    expect(aiEvent.data?.imageUrl).toBe('https://mocked.image.url');
  });

  it('should handle HTTP error when fetching a haiku', async () => {
    const promise = firstValueFrom(service.generateHaiku$());
    const req = httpMock.expectOne(`${apiUrl}/generate-haiku`);
    req.flush('Server error', { status: 500, statusText: 'Internal Haiku Blow-up OMG' });

    try {
      await promise;
      fail('Expected promise to reject');
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpErrorResponse);
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Haiku Blow-up OMG');
      expect(error.error).toBe('Server error');
    }
  });


  it('should handle HTTP error when fetching a haiku', async () => {
    let errorResult: HttpErrorResponse | undefined;
    service.generateHaiku$().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        errorResult = error;
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Haiku Blow-up OMG');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/generate-haiku`);
    req.flush('Server error', { status: 500, statusText: 'Internal Haiku Blow-up OMG' });
  });

});
