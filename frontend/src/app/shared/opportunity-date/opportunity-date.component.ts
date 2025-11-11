import { LowerCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { CalendarDate } from '@app/models/calendar-date.model';
import { DateTimeService } from '@app/services/date-time.service';

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
    const formattedDate = this.dateTimeService.formatDateInLocaleTime(startDate, 'EEEE, MMMM d, yyyy', this.opportunity().timeZone);
    return `${formattedDate}`;
  });

  timestamp = computed(() => {
    const startDate = new Date(this.opportunity().startDate);
    const endDate = new Date(this.opportunity().endDate);
    const formattedStartTime = this.dateTimeService.formatDateInLocaleTime(startDate, 'h:mma', this.opportunity().timeZone);
    const formattedEndTime = this.dateTimeService.formatDateInLocaleTime(endDate, 'h:mma', this.opportunity().timeZone);
    return `${formattedStartTime} - ${formattedEndTime}`;
  });
}
