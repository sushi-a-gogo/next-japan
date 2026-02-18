import { Component, inject, OnInit, signal } from '@angular/core';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventPageService } from '@app/features/events/pages/event-page/event-page.service';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { SelectOpportunityButtonComponent } from '@app/features/registrations/ui/select-opportunity-button/select-opportunity-button.component';

@Component({
  selector: 'app-event-opportunities',
  imports: [SelectOpportunityButtonComponent, EventOpportunityCardComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent implements OnInit {
  private eventPageService = inject(EventPageService);

  opportunities = signal<EventOpportunity[]>([]);

  ngOnInit(): void {
    const availableOpportunities = this.eventPageService.eventData().opportunities;
    this.opportunities.set(availableOpportunities.slice(0, 12));
  }
}
