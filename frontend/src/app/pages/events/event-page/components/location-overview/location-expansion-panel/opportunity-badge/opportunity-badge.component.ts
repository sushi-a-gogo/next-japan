import { Component, computed, input } from '@angular/core';
import { RegistrationContext, RegistrationStatus } from '@app/models/event/event-registration.model';

@Component({
  selector: 'app-opportunity-badge',
  imports: [],
  templateUrl: './opportunity-badge.component.html',
  styleUrl: './opportunity-badge.component.scss'
})
export class OpportunityBadgeComponent {
  status = RegistrationStatus;
  context = input<RegistrationContext | null>(null);

  iconName = computed(() => {
    if (this.context()?.registrationStatus === RegistrationStatus.Registered) {
      return 'calendar_check';
    }
    if (this.context()?.registrationStatus === RegistrationStatus.Requested) {
      return 'calendar_check';
    }
    if (this.context()?.conflicted) {
      return 'event_busy';
    }
    return 'calendar_add_on';
  });

  className = computed(() => {
    if (this.context()?.registrationStatus === RegistrationStatus.Registered) {
      return 'verified';
    }
    if (this.context()?.registrationStatus === RegistrationStatus.Requested) {
      return 'pending_actions';
    }
    if (this.context()?.conflicted) {
      return 'block';
    }
    return 'calendar_add_on';
  });
}
