import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { RegistrationStatus } from '@app/models/event/event-registration.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';

@Component({
  selector: 'app-opportunity-selector',
  imports: [TitleCasePipe, MatRippleModule, MatTooltipModule],
  templateUrl: './opportunity-selector.component.html',
  styleUrl: './opportunity-selector.component.scss'
})
export class OpportunitySelectorComponent {
  private auth = inject(AuthMockService);
  private registrationService = inject(EventRegistrationService);
  private selectionService = inject(EventSelectionService);
  private dialogService = inject(DialogService);

  opportunity = input.required<EventOpportunity>();

  isAuthenticated = this.auth.isAuthenticated;
  private user = this.auth.user;

  selected = computed(() => {
    const selections = this.selectionService.selectedOpportunities();
    return !!selections.find((s) => this.match(s));

  });

  registration = computed(() => {
    const reg = this.registrationService.registrations().find((r) => r.opportunity.opportunityId === this.opportunity().opportunityId && r.userId === this.user()?.userId);
    if (!reg || reg.status === RegistrationStatus.Cancelled) {
      return null;
    }

    return reg;
  });

  conflicted = computed(() => {
    if (this.isAuthenticated() && !this.registration()) {
      return this.selectionService.checkForConflict(this.opportunity()) || this.registrationService.checkForConflict(this.opportunity(), this.user()!.userId);
    }
    return false;
  });

  selectOpportunity() {
    this.selectionService.selectOpportunity(this.opportunity(), !this.selected());
    this.dialogService.showRegistrationDialog();
  }

  private match(opportunity: EventOpportunity) {
    return opportunity.opportunityId === this.opportunity().opportunityId;
  }
}
