import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { EventLocationCard } from '@app/features/events/ui/event-location-card/event-location-card.component';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { ImageService } from '@core/services/image.service';
import { EventRegistration, RegistrationStatus } from '@features/events/models/event-registration.model';
import { EventRegistrationStatusComponent } from './event-registration-status/event-registration-status.component';

@Component({
  selector: 'app-event-registration-card',
  imports: [NgOptimizedImage, EventLocationCard, EventOpportunityCardComponent, EventRegistrationStatusComponent, AnchorComponent, ButtonComponent],
  templateUrl: './event-registration-card.component.html',
  styleUrl: './event-registration-card.component.scss'
})
export class EventRegistrationCardComponent implements OnInit {
  private imageService = inject(ImageService);

  event = input.required<EventRegistration>();
  cancelRegistration = output();

  isGrokEvent = computed(() => false); //this.event().aiProvider === 'Grok');

  resizedImage = computed(() => {
    const width = this.isGrokEvent() ? 385 : 385;
    return this.imageService.resizeImage(this.event().image, width, 220);
  });

  registrationStatus = RegistrationStatus;

  routerLink: string = '';

  ngOnInit() {
    this.routerLink = `/event/${this.event().opportunity.eventId}`;
  }

  confirmCancel() {
    this.cancelRegistration.emit();
  }

}

