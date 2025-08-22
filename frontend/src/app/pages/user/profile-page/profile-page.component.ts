import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserProfileComponent } from '@app/components/user-profile/user-profile.component';
import { AuthMockService } from '@app/services/auth-mock.service';
import { MetaService } from '@app/services/meta.service';
import { UserAvatarComponent } from '@app/shared/avatar/user-avatar/user-avatar.component';
import { NextEventComponent } from "./next-event/next-event.component";
import { ProfileBadgesComponent } from "./profile-badges/profile-badges.component";

@Component({
  selector: 'app-profile-page',
  imports: [UserAvatarComponent, UserProfileComponent, ProfileBadgesComponent, NextEventComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  private title = inject(Title);
  private meta = inject(MetaService);
  private auth = inject(AuthMockService);
  user = this.auth.user;
  showProfileForm = signal<boolean>(false);

  ngOnInit(): void {
    this.title.setTitle(`${this.user()?.firstName} ${this.user()?.lastName}`);
    const description = "View and manage your user setting in Next Japan. See your next event and achievements!";
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
