import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { EventData } from '@app/models/event/event-data.model';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { User } from '@app/models/user.model';
import { UserProfileComponent } from '@app/pages/user/profile-page/user-profile/user-profile.component';
import { AuthMockService } from '@app/services/auth-mock.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventsService } from '@app/services/events.service';
import { MetaService } from '@app/services/meta.service';
import { UserAvatarComponent } from '@app/shared/avatar/user-avatar/user-avatar.component';
import { ModalComponent } from "@app/shared/modal/modal.component";
import { switchMap } from 'rxjs';
import { EventRegistrationsComponent } from "../event-registrations/event-registrations.component";
import { NextEventComponent } from "./next-event/next-event.component";
import { ProfileBadgesComponent } from "./profile-badges/profile-badges.component";
import { SurpriseComponent } from "./surprise/surprise.component";

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, MatTabsModule, UserAvatarComponent, DatePipe, UserProfileComponent, ProfileBadgesComponent, NextEventComponent, ModalComponent, SurpriseComponent, EventRegistrationsComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private auth = inject(AuthMockService);
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventsService);
  private registrationService = inject(EventRegistrationService);
  private destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);
  avatar = computed(() => {
    const user = this.user();
    if (user && !user!.image.id) {
      return {
        ...user!,
        image: this.defaultAvatar
      }
    }
    return user;
  });

  selectedIndex = 0;
  suggestedEvent = signal<EventData | undefined>(undefined);
  nextEventRegistration = computed(() => {
    const registrations = this.registrationService.userEventRegistrations();
    const next = registrations.length ? [...registrations].sort(this.sortByDate)[0] : undefined;
    return next;
  });

  loaded = signal(false);
  showProfileForm = signal<boolean>(false);
  showSurprise = signal<boolean>(false);
  surpriseBusy = signal<boolean>(false);

  private events = signal<EventData[]>([]);

  private defaultAvatar: AppImageData = {
    width: 1792,
    height: 1024,
    id: 'default-image',
    cloudflareImageId: '1815f4c9-c6c9-4856-8992-ea566c0b7400',
  };

  constructor() {
    effect(() => {
      if (this.auth.user()) {
        this.user.set(this.auth.user()!);
        this.title.setTitle(`${this.user()?.firstName} ${this.user()?.lastName}`);
        const description = "View and manage your user setting in Next Japan. See your next event and achievements!";
        this.meta.updateTags(this.title.getTitle(), description);
      }
    })
  }

  ngOnInit(): void {
    this.selectedIndex = this.route.snapshot.queryParams['action'] === 'manage' ? 1 : 0;
    const userId = this.user()?.userId || '';
    const observables = {
      events: this.eventsService.get$(),
      registrations: this.registrationService.getUserEventRegistrations$(userId)
    };
    this.eventsService.get$().pipe(
      switchMap((events) => {
        this.events.set(events);
        return this.registrationService.getUserEventRegistrations$(userId);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((resp) => {
      const registeredIds = resp.data.map((r) => r.opportunity.eventId);
      const unregisteredEvents = this.events().filter((e) => !registeredIds.includes(e.eventId));
      const randomIndex = Math.floor(Math.random() * unregisteredEvents.length);
      const suggestion = randomIndex >= 0 ? unregisteredEvents[randomIndex] : undefined;
      this.suggestedEvent.set(suggestion);
      this.loaded.set(true);
    })
  }

  openProfile() {
    this.showProfileForm.set(true);
  }


  closeProfileDialog() {
    this.showProfileForm.set(false);
  }

  openSurprise() {
    this.showSurprise.set(true);
    this.surpriseBusy.set(true);
  }

  surpriseReady(ready: boolean) {
    this.surpriseBusy.set(!ready);
  }

  closeSurprise() {
    if (!this.surpriseBusy()) {
      this.showSurprise.set(false);
    }
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }

}
