import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, input, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

import { EventLocation } from '@app/models/event/event-location.model';
import { EventService } from '@app/pages/events/event-page/event.service';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { OpportunitySelectorComponent } from "@app/shared/opportunity-selector/opportunity-selector.component";
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";

@Component({
  selector: 'app-location-expansion-panel',
  imports: [MatExpansionModule, MatRippleModule, AddressStripComponent, OpportunityTimestampComponent, OpportunitySelectorComponent],
  templateUrl: './location-expansion-panel.component.html',
  styleUrl: './location-expansion-panel.component.scss'
})
export class LocationExpansionPanelComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private eventService = inject(EventService);

  location = input.required<EventLocation>();

  accordion = viewChild<MatExpansionPanel>('accordion');
  @ViewChild(MatRipple) ripple?: MatRipple;

  opportunities = computed(() => {
    const items = this.eventService.eventData().opportunities
      .filter((opp) => opp.locationId === this.location().locationId);
    items.sort((a, b) => new Date(a.startDate) < new Date(b.startDate) ? -1 : 1);
    return items;
  });
  expanded = signal<boolean>(true);


  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.selectLocation()
      }
    });
  }

  selectLocation() {
    this.accordion()!.toggle();
  }
}
