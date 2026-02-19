import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { AppImageData } from '@app/core/models/app-image-data.model';
import { User } from '@app/core/models/user.model';
import { MetaService } from '@app/core/services/meta.service';
import { AiSurpriseComponent } from "@app/features/ai/ui/ai-surprise/ai-surprise.component";
import { ProfileDialogComponent } from '@app/features/user/pages/user-dashboard/profile-dialog/profile-dialog.component';
import { UserAvatarComponent } from '@app/features/user/ui/avatar/user-avatar/user-avatar.component';
import { AnchorComponent } from '@app/shared/ui/anchor/anchor.component';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { ModalComponent } from "@app/shared/ui/modal/modal.component";
import { EventRegistrationsComponent } from "./event-registrations/event-registrations.component";
import { ManageSubscriptionComponent } from "./manage-subscription/manage-subscription.component";
import { ProfileBadgesComponent } from "./profile-badges/profile-badges.component";
import { SuggestedEventsComponent } from "./suggested-events/suggested-events.component";

@Component({
  selector: 'app-user-dashboard',
  imports: [
    MatTabsModule,
    UserAvatarComponent,
    DatePipe,
    AnchorComponent,
    ButtonComponent,
    ProfileDialogComponent,
    ProfileBadgesComponent,
    SuggestedEventsComponent,
    ModalComponent,
    AiSurpriseComponent,
    EventRegistrationsComponent,
    ManageSubscriptionComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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


  selectedIndex = signal<number>(0);

  loaded = signal(false);
  showProfileDialog = signal<boolean>(false);
  showSurprise = signal<boolean>(false);
  surpriseBusy = signal<boolean>(false);

  private defaultAvatar: AppImageData = {
    width: 1792,
    height: 1024,
    id: 'default-image',
    cloudflareImageId: '1815f4c9-c6c9-4856-8992-ea566c0b7400',
  };

  ngOnInit(): void {
    if (this.auth.user()) {
      this.user.set(this.auth.user()!);
      this.title.setTitle(`${this.user()?.firstName} ${this.user()?.lastName}`);
      const description = "View and manage your user setting in Next Japan. See your next event and achievements!";
      this.meta.updateTags(this.title.getTitle(), description);
    }
    this.selectedIndex.set(this.route.snapshot.queryParams['action'] === 'manage' ? 1 : 0);
  }

  onTabChange(event: MatTabChangeEvent) {
    this.clearQueryParams();
    this.selectedIndex.set(event.index);
  }

  clearQueryParams() {
    this.router.navigate([], { queryParams: {} });
  }

  openProfileDialog() {
    this.showProfileDialog.set(true);
  }

  closeProfileDialog() {
    this.showProfileDialog.set(false);
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
