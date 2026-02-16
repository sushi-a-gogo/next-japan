import { Component, computed, inject, input } from '@angular/core';
import { DateTimeService } from '@core/services/date-time.service';
import { EventOpportunity } from '@features/events/models/event-opportunity.model';

@Component({
  selector: 'app-event-opportunity-card',
  imports: [],
  templateUrl: './event-opportunity-card.component.html',
  styleUrl: './event-opportunity-card.component.scss'
})
export class EventOpportunityCardComponent {
  private dateTimeService = inject(DateTimeService);

  opportunity = input.required<EventOpportunity>();
  showIcon = input<boolean>(true);
  showNotes = input<boolean>(true);

  timestamp = computed(() => {
    const startDate = new Date(this.opportunity().startDate);
    const endDate = new Date(this.opportunity().endDate);
    if (this.dateTimeService.isValidDate(startDate) && this.dateTimeService.isValidDate(endDate)) {
      const formattedStartDate = this.dateTimeService.formatDateInLocaleTime(startDate, 'EEE, MMM d, yyyy h:mm a', this.opportunity().timeZone);
      const formattedEndDate = this.dateTimeService.formatDateInLocaleTime(endDate, 'h:mm a', this.opportunity().timeZone);
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
    return null;
  });
}
