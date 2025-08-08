import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from '@app/models/user.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from "@shared/avatar/user-avatar/user-avatar.component";
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  imports: [RouterLink, MatButtonModule, MatMenuModule, MatTooltipModule, UserAvatarComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  private dialogService = inject(DialogService);
  private authService = inject(AuthMockService);
  private userProfileService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  user = input.required<User>();
  signout = output();

  logout() {
    this.signout.emit();
  }

  openUserProfile() {
    this.dialogService.showProfileDialog();
  }

  changeAppearanceMode(mode?: 'light' | 'dark') {
    this.userProfileService.getUser$(this.user().userId).pipe(
      switchMap((data) => {
        data.user.mode = mode;
        return this.userProfileService.updateProfile$(data.user);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((resp) => {
      this.authService.updateUserData(resp.data);
    });
  }
}
