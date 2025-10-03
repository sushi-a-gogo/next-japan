import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { ImageService } from '@app/services/image.service';
import { AddressStripComponent } from '@app/shared/address-strip/address-strip.component';
import { AnchorComponent } from '@app/shared/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/button/button.component';
import { OpportunityTimestampComponent } from '@app/shared/opportunity-timestamp/opportunity-timestamp.component';
import { EventRegistrationStatusComponent } from './event-registration-status/event-registration-status.component';

@Component({
  selector: 'app-event-registration-card',
  imports: [NgOptimizedImage, AddressStripComponent, OpportunityTimestampComponent, EventRegistrationStatusComponent, AnchorComponent, ButtonComponent],
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

