import { Component, DestroyRef, effect, ElementRef, inject, OnInit, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { EventLocation } from '@app/pages/event/models/event-location.model';
import { EventRegistration } from '@app/pages/event/models/event-registration.model';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventSelectionService } from '@app/services/event-selection.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { UtilService } from '@app/services/util.service';
import { LoadingSpinnerComponent } from "@app/shared/loading-spinner/loading-spinner.component";
import { ModalComponent } from "@app/shared/modal/modal.component";
import { of, switchMap } from 'rxjs';
import { RegistrationLocationComponent } from './registration-location/registration-location.component';

@Component({
  selector: 'app-registration-dialog',
  imports: [MatButtonModule, MatRippleModule, ModalComponent, RegistrationLocationComponent, LoadingSpinnerComponent],
  templateUrl: './registration-dialog.component.html',
  styleUrl: './registration-dialog.component.scss'
})
export class RegistrationDialogComponent implements OnInit {
  private registrationService = inject(EventRegistrationService);
  private selectionService = inject(EventSelectionService);
  private userProfileService = inject(UserProfileService);
  private util = inject(UtilService);
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
      const address = this.util.getEventDisplayAddress(opportunity);
      let location = this.selectedLocations.find((l) => l.displayAddress === address);
      if (location) {
        location.opportunities?.push(opportunity);
      } else {
        location = {
          locationId: opportunity.locationId,
          name: opportunity.locationName,
          notes: opportunity.locationNotes,
          eventId: 0,
          addressLine1: opportunity.addressLine1,
          city: opportunity.city,
          state: opportunity.state,
          zip: opportunity.zip,
          displayAddress: address,
          opportunities: [opportunity],
        };
        this.selectedLocations.push(location);
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
      .subscribe((success) => {
        this.busy.set(false);
        if (success) {
          this.selectionService.clearAllSelected();
          this.completed.set(true);
          //this.closeDialog();
        }
      });
  }

  closeDialog() {
    this.close.emit(true);
  }

  private requestSelected$() {
    const requests = this.selected();
    const userID = this.userProfileService.userProfile()!.userId;
    return this.registrationService.requestOpportunities$(requests, userID).pipe(
      switchMap((registrations) => {
        const success = registrations.map((reg: EventRegistration) => requests.find((s) => s.opportunityId === reg.opportunityId)!);
        return of(success.length > 0);
      })
    );
  }

  private getMainElementStyle() {
    const mainElm = this.main()?.nativeElement;
    return mainElm?.clientHeight < mainElm?.scrollHeight ? { overflow: 'auto' } : { overflow: 'hidden' };
  }

}
