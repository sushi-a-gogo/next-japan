import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserProfile } from '@app/models/user-profile.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { AvatarComponent } from "@shared/avatar/avatar.component";
import { ModalComponent } from "@shared/modal/modal.component";
import { of, switchMap } from 'rxjs';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatProgressSpinnerModule, AvatarComponent, ModalComponent, SignUpFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  mode = signal<'sign-in' | 'sign-up'>(this.auth.isAuthenticating() || 'sign-in');
  users = signal<UserProfile[]>([]);
  selectedUserId = signal<number>(0);
  busy = signal<boolean>(false);
  loaded = signal(false);

  signUpMode = computed(() => this.mode() === 'sign-up');
  modeHeaderText = computed(() => this.signUpMode() ? "Create your account" : "Choose an account")
  modeSupportingText = computed(() => this.signUpMode() ? "Already have an account?" : "Don't have an account?")
  modeButtonText = computed(() => this.signUpMode() ? "Sign in" : "Sign up")

  ngOnInit(): void {
    this.userService.getUsers$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.users.set(users);
      this.loaded.set(true);
    })
  }

  switchMode() {
    this.busy.set(true);
    setTimeout(() => {
      this.mode.update((prev) => prev === 'sign-in' ? 'sign-up' : 'sign-in');
      this.busy.set(false);
    }, 750);
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
    this.busy.set(true);
    this.userService.getUser$(this.selectedUserId()).pipe(
      switchMap((user) => {
        this.auth.login(user);
        return of(user);
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
    ;
  }
}
