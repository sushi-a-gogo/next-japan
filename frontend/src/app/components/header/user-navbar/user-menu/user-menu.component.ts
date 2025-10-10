import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from '@app/models/user.model';
import { AuthService } from '@app/services/auth.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from "@shared/avatar/user-avatar/user-avatar.component";
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  imports: [RouterLink, MatButtonModule, MatMenuModule, MatTooltipModule, UserAvatarComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  user = input.required<User>();
  signout = output();

  logout() {
    this.signout.emit();
  }

  changeAppearanceMode(mode?: 'light' | 'dark') {
    this.userProfileService.getUser$(this.user().userId).pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          res.data.mode = mode;
          return this.userProfileService.updateProfile$(res.data);
        }

        return of(res);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      if (res.success && res.data) {
        this.authService.updateUserData(res.data);
      }
    });
  }
}
