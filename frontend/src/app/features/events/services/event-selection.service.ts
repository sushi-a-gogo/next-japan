import { inject, Injectable, signal } from '@angular/core';
import { DialogService } from '@app/core/services/dialog.service';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';

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
