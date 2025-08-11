import { Component, computed, inject, input } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { DateTimeService } from '@app/services/date-time.service';

@Component({
  selector: 'app-opportunity-timestamp',
  imports: [],
  templateUrl: './opportunity-timestamp.component.html',
  styleUrl: './opportunity-timestamp.component.scss'
})
export class OpportunityTimestampComponent {
  private dateTimeService = inject(DateTimeService);

  opportunity = input.required<EventOpportunity>();
  iconColor = input<string>();

  timestamp = computed(() => {
    const startDate = new Date(this.opportunity().startDate);
    const endDate = new Date(this.opportunity().endDate);
    const formattedStartDate = this.dateTimeService.formatDateInLocaleTime(startDate, 'EEE, MMM d, yyyy h:mma', this.opportunity().timeZone);
    const formattedEndDate = this.dateTimeService.formatDateInLocaleTime(endDate, 'h:mma', this.opportunity().timeZone);
    return `${formattedStartDate} - ${formattedEndDate}`;
  });
}
