import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthMockService } from '@app/services/auth-mock.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { switchMap } from 'rxjs';
import { ColorBarComponent } from "./color-bar/color-bar.component";
import { UserNavbarComponent } from "./user-navbar/user-navbar.component";

@Component({
  selector: 'app-header',
  imports: [UserNavbarComponent, ColorBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  private auth = inject(AuthMockService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.auth.isAuthenticated$.pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return this.userProfileService.getUserProfile$();
        }
        return this.userProfileService.clearUserProfile();
      }), takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
