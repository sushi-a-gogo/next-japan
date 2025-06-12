import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, input, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

import { EventService } from '@app/event/event.service';
import { EventLocation } from '@app/event/models/event-location.model';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { OpportunityLabelComponent } from "@app/shared/opportunity-label/opportunity-label.component";
import { OpportunitySelectorComponent } from "@app/shared/opportunity-selector/opportunity-selector.component";

@Component({
  selector: 'app-location-expansion-panel',
  imports: [MatExpansionModule, MatRippleModule, AddressStripComponent, OpportunityLabelComponent, OpportunitySelectorComponent],
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
    const items = this.eventService.eventOpportunities().filter((opp) => opp.locationId === this.location().locationId);
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
