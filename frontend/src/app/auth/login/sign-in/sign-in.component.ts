import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@app/models/user.model';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from '@app/shared/avatar/user-avatar/user-avatar.component';

@Component({
  selector: 'app-sign-in',
  imports: [UserAvatarComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  users = signal<User[]>([]);
  selectedUserId = signal<string | null>(null);
  loaded = signal(false);

  signIn = output<string>();
  cancel = output();

  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.userService.getUsers$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((resp) => {
      this.users.set(resp.data.slice(0, 2));
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
