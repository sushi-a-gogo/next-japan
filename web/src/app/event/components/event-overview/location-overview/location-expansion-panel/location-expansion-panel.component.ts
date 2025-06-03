import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, input, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

import { EventService } from '@app/event/event.service';
import { EventLocation } from '@app/event/models/event-location.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
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
  location = input.required<EventLocation>();

  accordion = viewChild<MatExpansionPanel>('accordion');
  @ViewChild(MatRipple) ripple?: MatRipple;

  opportunities = signal<EventOpportunity[]>([]);
  expanded = signal<boolean>(true);
  loading = signal<boolean>(false);
  private loaded = false;

  private breakpointObserver = inject(BreakpointObserver);
  private eventService = inject(EventService);
  private destroyRef = inject(DestroyRef);

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
    if (this.loaded) {
      this.accordion()!.toggle();
      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.eventService.getEventOpportunities$(this.location())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const items = res.hasError ? [] : (res.retVal as EventOpportunity[]);
        items.sort((a, b) => new Date(a.startDate) < new Date(b.startDate) ? -1 : 1);
        this.opportunities.set(items);
        this.loading.set(false);
        this.loaded = true;
        this.accordion()!.toggle();
      });
  }
}
