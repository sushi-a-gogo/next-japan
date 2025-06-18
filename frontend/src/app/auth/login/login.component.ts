import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfile } from '@app/models/user-profile.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';
import { of, switchMap } from 'rxjs';
import { AvatarComponent } from "../../shared/avatar/avatar.component";
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: 'app-login',
  imports: [LoadingSpinnerComponent, AvatarComponent, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  users = signal<UserProfile[]>([]);
  selectedUserId = signal<number>(0);
  busy = signal<boolean>(false);
  loaded = signal(false);

  ngOnInit(): void {
    this.userService.getUsers$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.users.set(users);
      this.loaded.set(true);
    })
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
    this.userService.getUser$(this.selectedUserId()).pipe(
      switchMap((user) => {
        this.auth.login();
        return of(user);
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
    ;
  }
}
