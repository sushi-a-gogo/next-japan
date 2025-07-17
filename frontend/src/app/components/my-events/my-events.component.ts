import { Component, computed, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { ModalComponent } from "@app/shared/modal/modal.component";
import { MyEventCardComponent } from "./my-event-card/my-event-card.component";

@Component({
  selector: 'app-my-events',
  imports: [MatButtonModule, MatRippleModule, ModalComponent, MyEventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss'
})
export class MyEventsComponent {
  private registrationService = inject(EventRegistrationService);
  private userService = inject(UserProfileService);
  private user = this.userService.userProfile;

  close = output<boolean>();
  // if this was a real app, this would be fetched from an api instead of being pulled this signal
  // and/or the registrationService would be also used to fetch the registrations and seed the signal
  events = computed(() =>
    this.registrationService.registrations().filter((r) => r.userId === this.user()?.userId).sort(this.sortByDate));

  closeDialog() {
    this.close.emit(true);
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }
}
