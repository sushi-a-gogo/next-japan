import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppImageData } from '@app/models/app-image-data.model';
import { User } from '@app/models/user.model';
import { UserProfileComponent } from '@app/pages/user/profile-page/user-profile/user-profile.component';
import { AuthMockService } from '@app/services/auth-mock.service';
import { MetaService } from '@app/services/meta.service';
import { UserAvatarComponent } from '@app/shared/avatar/user-avatar/user-avatar.component';
import { ModalComponent } from "@app/shared/modal/modal.component";
import { EventRegistrationsComponent } from "../event-registrations/event-registrations.component";
import { ManageSubscriptionComponent } from "./manage-subscription/manage-subscription.component";
import { NextEventComponent } from "./next-event/next-event.component";
import { ProfileBadgesComponent } from "./profile-badges/profile-badges.component";
import { SurpriseComponent } from "./surprise/surprise.component";

@Component({
  selector: 'app-profile-page',
  imports: [
    RouterLink,
    MatTabsModule,
    UserAvatarComponent,
    DatePipe,
    UserProfileComponent,
    ProfileBadgesComponent,
    NextEventComponent,
    ModalComponent,
    SurpriseComponent,
    EventRegistrationsComponent,
    ManageSubscriptionComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private auth = inject(AuthMockService);
  private route = inject(ActivatedRoute);

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

  loaded = signal(false);
  showProfileForm = signal<boolean>(false);
  showSurprise = signal<boolean>(false);
  surpriseBusy = signal<boolean>(false);

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
}
