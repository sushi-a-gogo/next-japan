import { Component, input, OnInit, signal } from '@angular/core';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { SelectOpportunityButtonComponent } from '@app/features/registrations/ui/select-opportunity-button/select-opportunity-button.component';

@Component({
  selector: 'app-event-opportunities',
  imports: [SelectOpportunityButtonComponent, EventOpportunityCardComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent implements OnInit {
  opportunities = input<EventOpportunity[] | null>(null);
  slicedOpportunities = signal<EventOpportunity[]>([]);

  ngOnInit(): void {
    this.slicedOpportunities.set(this.opportunities()?.slice(0, 6) || []);
  }
}
