import { Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';

@Injectable({
  providedIn: 'root',
})
export class EventSelectionService {
  private selected = signal<EventOpportunity | null>(null);
  selectedOpportunity = this.selected.asReadonly();

  constructor() { }

  checkForConflict(opportunity: EventOpportunity) {
    const item = this.selected();
    if (!item || item.opportunityId === opportunity.opportunityId) {
      return false;
    }

    const startTime = new Date(item.startDate);
    const selectedStartTime = new Date(opportunity.startDate);
    const selectedEndTime = new Date(opportunity.endDate);
    if (startTime >= selectedStartTime && startTime < selectedEndTime) {
      return true;
    }

    const endTime = new Date(item.endDate);
    if (endTime > selectedStartTime && endTime <= selectedEndTime) {
      return true;
    }

    return false;
  }

  selectOpportunity(opportunity: EventOpportunity, selected: boolean) {
    this.selected.set(selected ? opportunity : null);
  }

  clearSelected() {
    this.selected.set(null);
  }
}
