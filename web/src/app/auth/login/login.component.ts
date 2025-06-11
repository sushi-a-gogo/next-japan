import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';
import { of, switchMap } from 'rxjs';
import { DUMMY_USERS } from 'src/data/users/default-user';
import { AvatarComponent } from "../../shared/avatar/avatar.component";
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: 'app-login',
  imports: [RouterLink, LoadingSpinnerComponent, AvatarComponent, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  users = DUMMY_USERS;
  selectedUserId = signal<number>(0);
  busy = signal<boolean>(false);

  ngOnInit(): void {
    return;
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const returnTo = decodeURIComponent(params['returnTo'] || 'home');
      const authorizationParams = params['signup'] ? { screen_hint: 'signup' } : {};
      this.auth.loginWithRedirect({
        appState: { target: returnTo },
        authorizationParams: authorizationParams,
      });
    });
  }

  cancel() {
    this.auth.authenticationStop();
  }

  select(userId: number) {
    if (userId !== this.selectedUserId()) {
      this.selectedUserId.set(userId);
    } else {
      this.selectedUserId.set(0);
    }
  }

  signin() {
    this.userService.setUserProfile$(this.selectedUserId()).pipe(
      switchMap((user) => {
        this.auth.login();
        return of(user);
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
    ;
  }
}
