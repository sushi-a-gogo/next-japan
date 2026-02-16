import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';
import { ImageService } from '@core/services/image.service';
import { EventData } from '@events/models/event-data.model';

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
    const width = this.isGrokEvent() ? 342 : 448;
    return this.imageService.resizeImage(this.event().image, 448, 256);
  });

  learnMoreLabel = computed(() => `Go to the '${this.event().eventTitle}' event page to learn more.`)
  registerLabel = computed(() => `Go to the '${this.event().eventTitle}' event page to register.`)

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
