import { inject, Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class EventSelectionService {
  private dialogService = inject(DialogService);
  private selectionSignal = signal<EventOpportunity | null>(null);
  selectedOpportunity = this.selectionSignal.asReadonly();

  constructor() { }

  selectOpportunity(opportunity: EventOpportunity) {
    this.selectionSignal.set(opportunity);
    this.dialogService.showRegistrationDialog();
  }

  clearSelected() {
    this.selectionSignal.set(null);
  }
}
