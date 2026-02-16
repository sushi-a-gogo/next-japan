import { LowerCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { DateTimeService } from '@core/services/date-time.service';
import { CalendarDate } from '@features/events/models/calendar-date.model';

@Component({
  selector: 'app-opportunity-date',
  imports: [LowerCasePipe],
  templateUrl: './opportunity-date.component.html',
  styleUrl: './opportunity-date.component.scss'
})
export class OpportunityDateComponent {
  private dateTimeService = inject(DateTimeService);

  opportunity = input.required<CalendarDate>();

  datestamp = computed(() => {
    const startDate = new Date(this.opportunity().startDate);
    if (this.dateTimeService.isValidDate(startDate)) {
      const formattedDate = this.dateTimeService.formatDateInLocaleTime(startDate, 'EEEE, MMMM d, yyyy', this.opportunity().timeZone);
      return `${formattedDate}`;
    }

    return null;
  });

  timestamp = computed(() => {
    const startDate = new Date(this.opportunity().startDate);
    const endDate = new Date(this.opportunity().endDate);

    if (this.dateTimeService.isValidDate(startDate) && this.dateTimeService.isValidDate(endDate)) {
      const formattedStartTime = this.dateTimeService.formatDateInLocaleTime(startDate, 'h:mma', this.opportunity().timeZone);
      const formattedEndTime = this.dateTimeService.formatDateInLocaleTime(endDate, 'h:mma', this.opportunity().timeZone);
      return `${formattedStartTime} - ${formattedEndTime}`;
    }

    return null;
  });
}
