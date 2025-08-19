import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

import { EventLocation } from '@app/models/event/event-location.model';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { EventService } from '@app/pages/events/event-page/event.service';
import { EventSelectionService } from '@app/services/event-selection.service';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { OpportunityButtonComponent } from "./opportunity-button/opportunity-button.component";

@Component({
  selector: 'app-location-expansion-panel',
  imports: [MatExpansionModule, MatRippleModule, AddressStripComponent, OpportunityButtonComponent],
  templateUrl: './location-expansion-panel.component.html',
  styleUrl: './location-expansion-panel.component.scss'
})
export class LocationExpansionPanelComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private eventService = inject(EventService);
  private selectionService = inject(EventSelectionService);

  location = input.required<EventLocation>();
  accordion = viewChild<MatExpansionPanel>('accordion');

  opportunities = computed(() => {
    const items = this.eventService.eventData().opportunities
      .filter((opp) => opp.locationId === this.location().locationId);
    return items;
  });
  expanded = signal<boolean>(true);
  breakpointObserved = signal<boolean>(false);

  selectOpportunity(opportunity: EventOpportunity) {
    this.selectionService.selectOpportunity(opportunity);
  }


  constructor() {
    this.breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).pipe(takeUntilDestroyed()).subscribe(result => {
      //this.expanded.set(result.matches);
      this.breakpointObserved.set(true);
    });
  }

  selectLocation() {
    this.accordion()?.toggle();
    this.expanded.update((prev) => !prev);
  }
}
