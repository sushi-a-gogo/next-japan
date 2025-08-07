import { Component, DestroyRef, effect, ElementRef, inject, OnInit, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { EventLocation } from '@app/models/event/event-location.model';
import { EventService } from '@app/pages/events/event-page/event.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { ModalComponent } from "@app/shared/modal/modal.component";
import { of } from 'rxjs';
import { RegistrationLocationComponent } from './registration-location/registration-location.component';

@Component({
  selector: 'app-registration-dialog',
  imports: [RouterLink, MatButtonModule, MatRippleModule, ModalComponent, RegistrationLocationComponent, LoadingSpinnerComponent],
  templateUrl: './registration-dialog.component.html',
  styleUrl: './registration-dialog.component.scss'
})
export class RegistrationDialogComponent implements OnInit {
  private eventService = inject(EventService);
  private registrationService = inject(EventRegistrationService);
  private selectionService = inject(EventSelectionService);
  private userProfileService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  close = output<boolean>();
  main = viewChild<ElementRef>('main');

  selected = this.selectionService.selectedOpportunities;
  selectedLocations: EventLocation[] = [];
  selectedMultiple = this.selectionService.selectedCount > 2;
  mainElmStyle: any = { overflow: 'hidden' };
  busy = signal<boolean>(false);
  completed = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.selected().length === 0 && !this.completed()) {
        this.closeDialog();
      }
    });
  }


  ngOnInit(): void {
    this.selected().forEach((opportunity) => {
      let location = this.selectedLocations.find((l) => l.locationId === opportunity.locationId);
      if (location) {
        location.opportunities?.push(opportunity);
      } else {
        location = this.eventService.eventData().locations.find((l) => l.locationId === opportunity.locationId);
        if (location) {
          location!.opportunities = [opportunity];
          this.selectedLocations.push(location);
        }
      }
    });
  }


  ngAfterViewInit(): void {
    this.mainElmStyle = this.getMainElementStyle();
  }

  sendRequest() {
    this.busy.set(true);
    this.requestSelected$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.busy.set(false);
        this.selectionService.clearAllSelected();
        this.completed.set(true);
      });
  }

  closeDialog() {
    this.close.emit(true);
  }

  private requestSelected$() {
    const event = this.eventService.eventData().event;
    if (!event) {
      return of([]);
    }

    const requests = this.selected().map((opportunity) => opportunity.opportunityId);
    const userId = this.userProfileService.userProfile()!.userId;
    return this.registrationService.requestOpportunities$(userId, requests);
  }

  private getMainElementStyle() {
    const mainElm = this.main()?.nativeElement;
    return mainElm?.clientHeight < mainElm?.scrollHeight ? { overflow: 'auto' } : { overflow: 'hidden' };
  }

}
