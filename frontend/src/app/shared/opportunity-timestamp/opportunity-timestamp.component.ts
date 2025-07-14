import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { DateTimeService } from '@app/services/date-time.service';

@Component({
  selector: 'app-opportunity-timestamp',
  imports: [DatePipe, LowerCasePipe],
  templateUrl: './opportunity-timestamp.component.html',
  styleUrl: './opportunity-timestamp.component.scss'
})
export class OpportunityTimestampComponent implements OnInit {
  opportunity = input.required<EventOpportunity>();
  startDate: Date | null = null;
  endDate: Date | null = null;
  format = input<string>('EEEE, MMMM d, yyyy');

  iconColor = input<string>();
  private dateTimeService = inject(DateTimeService);

  ngOnInit(): void {
    this.startDate = this.dateTimeService.adjustDateToTimeZoneOffset(this.opportunity().startDate, this.opportunity());
    this.endDate = this.dateTimeService.adjustDateToTimeZoneOffset(this.opportunity().endDate, this.opportunity());
  }
}
