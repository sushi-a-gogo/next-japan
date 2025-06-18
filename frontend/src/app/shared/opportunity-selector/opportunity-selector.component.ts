import { Component, computed, inject, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { RegistrationService } from '@app/services/registration.service';
import { SelectionService } from '@app/services/selection.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { RegistrationStatusLabelComponent } from "../registration-status-label/registration-status-label.component";

@Component({
  selector: 'app-opportunity-selector',
  imports: [MatRippleModule, MatTooltipModule, RegistrationStatusLabelComponent],
  templateUrl: './opportunity-selector.component.html',
  styleUrl: './opportunity-selector.component.scss'
})
export class OpportunitySelectorComponent {
  private auth = inject(AuthMockService);
  private registrationService = inject(RegistrationService);
  private selectionService = inject(SelectionService);
  private userService = inject(UserProfileService);

  opportunity = input.required<EventOpportunity>();
  mobileStyle = input<'checkbox' | 'button'>('button');

  isAuthenticated = this.auth.isAuthenticated;
  disableCheckForConflict = input<boolean>(false);
  private user = this.userService.userProfile;

  selected = computed(() => {
    const selections = this.selectionService.selectedOpportunities();
    return !!selections.find((s) => this.match(s));

  });

  status = computed(() => {
    const registration = this.registrationService.registrations().find((r) => r.opportunityId === this.opportunity().opportunityId && r.userId === this.user()?.userId);
    if (!registration) {
      return null;
    }

    return registration.status;
  });

  conflicted = computed(() => {
    if (this.isAuthenticated() && !this.status() && !this.disableCheckForConflict()) {
      return this.selectionService.checkForConflict(this.opportunity()) || this.registrationService.checkForConflict(this.opportunity(), this.user()!.userId);
    }
    return false;
  });

  selectOpportunity() {
    this.selectionService.selectOpportunity(this.opportunity(), !this.selected());
  }

  private match(opportunity: EventOpportunity) {
    return opportunity.opportunityId === this.opportunity().opportunityId;
  }
}
