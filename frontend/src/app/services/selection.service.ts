import { Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private selected = signal<EventOpportunity[]>([]);
  selectedOpportunities = this.selected.asReadonly();

  constructor() { }

  get selectedCount() {
    return this.selected().length;
  }

  checkForConflict(opportunity: EventOpportunity) {
    const selectedStartTime = new Date(opportunity.startDate);
    const selectedEndTime = new Date(opportunity.endDate);

    const items = [...this.selected()];
    const conflicted = items.filter((item) => {
      if (item.opportunityId !== opportunity.opportunityId) {
        const startTime = new Date(item.startDate);
        if (startTime >= selectedStartTime && startTime < selectedEndTime) {
          return true;
        }

        const endTime = new Date(item.endDate);
        if (endTime > selectedStartTime && endTime <= selectedEndTime) {
          return true;
        }
      }

      return false;
    });

    return conflicted.length > 0;
  }

  selectOpportunity(opportunity: EventOpportunity, selected: boolean) {
    this.selected.update((prev) => {
      if (selected) {
        return [...prev, opportunity];
      } else {
        return prev.filter((s) => s.opportunityId !== opportunity.opportunityId);
      }
    });
  }

  clearAllSelected() {
    this.selected.set([]);
  }
}
