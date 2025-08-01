import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfile } from '@app/models/user-profile.model';
import { UserProfileService } from '@app/services/user-profile.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';

@Component({
  selector: 'app-sign-in',
  imports: [AvatarComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  users = signal<UserProfile[]>([]);
  selectedUserId = signal<string | null>(null);
  loaded = signal(false);

  signIn = output<string>();
  cancel = output();

  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.userService.getUsers$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((users) => {
      this.users.set(users);
      this.loaded.set(true);
    })
  }

  select(userId: string) {
    if (userId !== this.selectedUserId()) {
      this.selectedUserId.set(userId);
    } else {
      this.selectedUserId.set(null);
    }
  }

  goBack() {
    this.selectedUserId.set(null);
    this.cancel.emit();
  }

}
