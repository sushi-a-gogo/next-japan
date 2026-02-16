import { LowerCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { DateTimeService } from '@app/core/services/date-time.service';
import { EventCalendarDate } from '@app/features/events/models/event-calendar-date.model';

@Component({
  selector: 'app-event-date-card',
  imports: [LowerCasePipe],
  templateUrl: './event-date-card.component.html',
  styleUrl: './event-date-card.component.scss'
})
export class EventDateCardComponent {
  private dateTimeService = inject(DateTimeService);

  calendarDate = input.required<EventCalendarDate>();

  datestamp = computed(() => {
    const startDate = new Date(this.calendarDate().startDate);
    if (this.dateTimeService.isValidDate(startDate)) {
      const formattedDate = this.dateTimeService.formatDateInLocaleTime(startDate, 'EEEE, MMMM d, yyyy', this.calendarDate().timeZone);
      return `${formattedDate}`;
    }

    return null;
  });

  timestamp = computed(() => {
    const startDate = new Date(this.calendarDate().startDate);
    const endDate = new Date(this.calendarDate().endDate);

    if (this.dateTimeService.isValidDate(startDate) && this.dateTimeService.isValidDate(endDate)) {
      const formattedStartTime = this.dateTimeService.formatDateInLocaleTime(startDate, 'h:mma', this.calendarDate().timeZone);
      const formattedEndTime = this.dateTimeService.formatDateInLocaleTime(endDate, 'h:mma', this.calendarDate().timeZone);
      return `${formattedStartTime} - ${formattedEndTime}`;
    }

    return null;
  });
}
