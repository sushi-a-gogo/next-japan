import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { CalendarDate } from '@app/models/calendar-date.model';
import { DateTimeService } from '@app/services/date-time.service';

@Component({
  selector: 'app-opportunity-date',
  imports: [DatePipe, LowerCasePipe],
  templateUrl: './opportunity-date.component.html',
  styleUrl: './opportunity-date.component.scss'
})
export class OpportunityDateComponent {
  private dateTime = inject(DateTimeService);

  opportunity = input.required<CalendarDate>();

  startDate = computed(() =>
    this.dateTime.adjustDateToTimeZoneOffset(this.opportunity().startDate, this.opportunity())
  );
  endDate = computed(() =>
    this.dateTime.adjustDateToTimeZoneOffset(this.opportunity().endDate, this.opportunity())
  );

}
