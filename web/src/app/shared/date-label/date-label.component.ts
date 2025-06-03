import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CalendarDate } from '@app/models/calendar-date.model';
import { DateTimeService } from '@app/services/date-time.service';

@Component({
  selector: 'app-date-label',
  imports: [DatePipe, LowerCasePipe],
  templateUrl: './date-label.component.html',
  styleUrl: './date-label.component.scss'
})
export class DateLabelComponent {
  dateTime = input.required<CalendarDate>();
  shortDate = input<boolean>(false);
  format = input<string>('EEEE, MMMM d, yyyy');
  layout = input<'flex-row' | 'center' | 'left'>('flex-row');
  startDate: Date | null = null;
  endDate: Date | null = null;

  private dateTimeService = inject(DateTimeService);

  ngOnInit(): void {
    this.startDate = this.dateTimeService.adjustDateToTimeZoneOffset(this.dateTime().startDate, this.dateTime());
    this.endDate = this.dateTimeService.adjustDateToTimeZoneOffset(this.dateTime().endDate, this.dateTime());
  }

}
