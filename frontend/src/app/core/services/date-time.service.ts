import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { CalendarDate } from '@app/features/events/models/calendar-date.model';
import { getTimezoneOffset } from 'date-fns-tz';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  private datePipe = inject(DatePipe);

  isValidDate(d: Date) {
    // Check if it is a Date object and if its time value is not NaN
    return d instanceof Date && !isNaN(d.getTime());
  }

  sortCalendarDates(a: CalendarDate, b: CalendarDate) {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }

  getDaysSince(dateString: string) {
    const startDate = new Date(dateString);
    const currentDate = new Date();

    const startMs = startDate.getTime();
    const currentMs = currentDate.getTime();

    const diffMs = currentMs - startMs;
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round(diffMs / oneDay);
  }

  getDaysUntil(dateString: string) {
    const endDate = new Date(dateString);
    const currentDate = new Date();

    const endMs = endDate.getTime();
    const currentMs = currentDate.getTime();

    const diffMs = endMs - currentMs;
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round(diffMs / oneDay);
  }

  getTimezoneOffset(timeZone: string, date: Date) {
    const effectiveOffset = getTimezoneOffset(timeZone, date) / 36e5; // Convert ms to hours
    const isPositive = effectiveOffset >= 0;
    const absOffset = Math.abs(effectiveOffset);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);
    const offsetString = `${isPositive ? '+' : '-'}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
    return offsetString;
  }

  formatDateInLocaleTime(date: Date, format: string, timeZone: string, locale = 'en-US') {
    try {
      const timeZoneOffset = this.getTimezoneOffset(timeZone, date);
      const formattedDate = this.datePipe.transform(
        date,
        format,
        timeZoneOffset,
        locale
      );
      return formattedDate;
    } catch {
      return null;
    }
  }
}
