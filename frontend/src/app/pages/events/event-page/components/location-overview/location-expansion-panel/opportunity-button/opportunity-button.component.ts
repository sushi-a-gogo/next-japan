import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { getRegistrationContext } from '@app/models/event/event-registration.model';
import { AuthService } from '@app/services/auth.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";
import { OpportunityBadgeComponent } from "../opportunity-badge/opportunity-badge.component";

@Component({
  selector: 'app-opportunity-button',
  imports: [MatTooltipModule, OpportunityTimestampComponent, OpportunityBadgeComponent],
  templateUrl: './opportunity-button.component.html',
  styleUrl: './opportunity-button.component.scss'
})
export class OpportunityButtonComponent {
  private datePipe = inject(DatePipe);
  private auth = inject(AuthService);
  private registrationService = inject(EventRegistrationService);

  opportunity = input.required<EventOpportunity>();
  disabled = computed(() => !this.auth.isAuthenticated());
  select = output();
  tooltipDisabled: boolean = true;

  context = computed(() => getRegistrationContext(this.opportunity(), this.registrationService.userEventRegistrations()));

  tooltipText = computed(() => {
    if (!this.auth.user()) {
      return 'Please sign in to register for an event.';
    }

    if (this.context()?.registrationId) {
      const date = this.datePipe.transform(this.context()!.registrationCreatedAt, 'mediumDate');
      return `You registered for this event on ${date}`;
    }

    return this.context()?.conflicted;
  });

  onSelect(tooltip: MatTooltip) {
    if (this.tooltipText()) {
      return;
    }

    this.select.emit();
  }
}
