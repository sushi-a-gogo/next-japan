import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/services/api.service';
import { AiEvent } from '@app/features/ai/models/ai-event.model';
import { EventData } from '@app/features/events/models/event-data.model';
import { EventsService } from '@app/features/events/services/events.service';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/events`;

  const mockEvents: EventData[] = [
    {
      "eventId": "1",
      "locationId": "1",
      "eventTitle": "Magical Hokkaido",
      "description": "A joyful, enchanting experience in Hokkaido’s vibrant fall foliage, where golden paths and cozy fireside moments create unforgettable memories.",
      "image": {
        "id": "event-image-1753927750041.png",
        "cloudflareImageId": "c933dfa9-ccde-4d63-86c5-5a2dd3fb1900",
        "width": 1792,
        "height": 1024
      },
      "aiProvider": "OpenAI",
      "createdAt": "2025-07-31T02:09:39.332Z"
    },
    {
      "eventId": "2",
      "locationId": "2",
      "eventTitle": "Tokyo Skyline Evening",
      "description": "A joyful exploration of Tokyo's vibrant skyline during a summer evening.",
      "image": {
        "id": "event-image-1758829548294.png",
        "cloudflareImageId": "3dfcd7d2-0d58-4dee-1f1a-053527666500",
        "width": 1792,
        "height": 1024
      },
      "aiProvider": "OpenAI",
      "createdAt": "2025-09-25T19:46:08.737Z"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsService,
        ApiService,
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a list of events', async () => {
    const promise = firstValueFrom(service.get$());

    const req = httpMock.expectOne(apiUrl);
    req.flush({ data: mockEvents });

    const events = await promise;
    expect(events.length).toBe(2);
    expect(events[0].eventTitle).toBe('Magical Hokkaido');
  });

  it('should fetch a single event by ID', async () => {
    const eventId = '1';
    const promise = firstValueFrom(service.getEvent$(eventId));

    const req = httpMock.expectOne(`${apiUrl}/${eventId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockEvents[0] });

    const event = await promise;
    expect(event).toBeTruthy();
    expect(event?.eventId).toBe('1');
    expect(event?.eventTitle).toBe('Magical Hokkaido');
  });

  it('should create a new event', () => {
    const newEvent: AiEvent = {
      eventTitle: 'New Year Bash',
      description: 'Big Fun Night',
      image: { id: 'image_1', width: 256, height: 256 },
      imageUrl: 'https://image.url',
      aiProvider: 'OpenAI'
    };

    service.saveEvent$(newEvent).subscribe(res => {
      expect(res.data).toBeTruthy();
      expect(res.data?.eventTitle).toBe('New Year Bash');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEvent);
    req.flush({ data: { ...newEvent } });
  });

  it('should handle HTTP errors gracefully', () => {
    service.get$().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
