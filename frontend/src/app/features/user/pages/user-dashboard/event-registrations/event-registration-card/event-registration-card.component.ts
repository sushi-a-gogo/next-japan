import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ImageService } from '@app/core/services/image.service';
import { EventLocationCard } from '@app/features/events/ui/event-location-card/event-location-card.component';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { EventRegistration, RegistrationStatus } from '@app/features/registrations/models/event-registration.model';
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";
import { EventRegistrationStatusComponent } from './event-registration-status/event-registration-status.component';

@Component({
  selector: 'app-event-registration-card',
  imports: [NgOptimizedImage, EventLocationCard, EventOpportunityCardComponent, EventRegistrationStatusComponent, NextButtonComponent, RouterLink],
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

