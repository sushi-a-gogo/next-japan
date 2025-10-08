import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { AuthService } from '@app/services/auth.service';
import { ImageService } from '@app/services/image.service';
import { AnchorComponent } from '@app/shared/anchor/anchor.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, AnchorComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);
  private imageService = inject(ImageService);

  event = input.required<EventData>();
  isGrokEvent = computed(() => this.event().aiProvider === 'Grok');
  resizedImage = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      const width = this.isGrokEvent() ? 342 : 448;
      return this.imageService.resizeImage(this.event().image, 448, 256);
    }
    return null;
  });

  routerLink = computed(() => `/event/${this.event().eventId}`);
  registerLink = computed(() => {
    if (this.auth.isAuthenticated()) {
      return this.routerLink();
    }
    return '/login';
  });
  registerQueryParams = computed(() => {
    if (this.auth.isAuthenticated()) {
      return undefined;
    }
    return { returnTo: this.routerLink() };
  });
}
