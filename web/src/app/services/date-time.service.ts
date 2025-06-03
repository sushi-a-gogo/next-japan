import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { LocationTimeZone } from 'src/app/models/location-time-zone.model';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  private readonly locale = 'en-US'; // locale code for the locale format rules to use

  constructor() {}

  formatDateAsString(date: Date, format: string) {
    return formatDate(date, format, this.locale);
  }

  getSimpleDateString(date: Date) {
    return formatDate(date, 'yyyy-MM-dd', this.locale);
  }

  adjustDateToTimeZoneOffset(dateString: string, location: LocationTimeZone) {
    const date = new Date(dateString);
    const timeZoneOffset = this.getTimeZoneOffset(location);
    const timeOffsetInMS = timeZoneOffset * 60 * 60 * 1000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
  }

  private getTimeZoneOffset(location: LocationTimeZone) {
    if (this.timeZoneHasOffsetDST(location) && this.isDST(new Date())) {
      return location.timeZoneOffsetDST || location.timeZoneOffset + 1;
    }

    return location.timeZoneOffset;
  }

  private timeZoneHasOffsetDST(location: LocationTimeZone) {
    return location.timeZoneOffsetDST || location.timeZoneAbbreviation.length === 2;
  }

  private isDST(d: Date) {
    const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
  }
}
