import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { UserProfileComponent } from '@app/components/user-profile/user-profile.component';
import { AppImageData } from '@app/models/app-image-data.model';
import { EventData } from '@app/models/event/event-data.model';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { User } from '@app/models/user.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { EventsService } from '@app/services/events.service';
import { MetaService } from '@app/services/meta.service';
import { UserAvatarComponent } from '@app/shared/avatar/user-avatar/user-avatar.component';
import { ModalComponent } from "@app/shared/modal/modal.component";
import { of, switchMap } from 'rxjs';
import { NextEventComponent } from "./next-event/next-event.component";
import { ProfileBadgesComponent } from "./profile-badges/profile-badges.component";
import { SurpriseComponent } from "./surprise/surprise.component";

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, UserAvatarComponent, UserProfileComponent, ProfileBadgesComponent, NextEventComponent, ModalComponent, SurpriseComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private auth = inject(AuthMockService);
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

  suggestedEvent = signal<EventData | undefined>(undefined);

  nextEvent = computed(() => {
    const registrations = this.registrationService.userEventRegistrations();
    return registrations.length ? [...registrations].sort(this.sortByDate)[0] : undefined;
  });

  loaded = signal(false);
  showProfileForm = signal<boolean>(false);
  showSurprise = signal<boolean>(false);
  haiku = signal<string>('');

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
    const userId = this.user()?.userId || '';
    this.registrationService.getUserEventRegistrations$(userId).pipe(
      switchMap((resp) => resp.data.length > 0 ? of([]) : this.eventsService.get$()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((events) => {
      if (events.length) {
        const randomIndex = Math.floor(Math.random() * events.length);
        this.suggestedEvent.set(events[randomIndex]);
      }
      this.loaded.set(true);
    })
  }

  hideProfile(user?: User) {
    if (user) {
      this.user.set(user);
    }

    this.showProfileForm.set(false);
  }

  getSurprise() {
    this.showSurprise.set(true);
  }

  private sortByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }

}
