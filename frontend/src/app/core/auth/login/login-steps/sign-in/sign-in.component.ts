import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '@app/features/user/models/user.model';
import { UserProfileService } from '@app/features/user/services/user-profile.service';
import { UserAvatarComponent } from '@app/features/user/ui/avatar/user-avatar/user-avatar.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, UserAvatarComponent, ButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  loaded = signal(false);

  signIn = output<string>();
  switchToSignUp = output();

  ngOnInit(): void {
    this.userService.getUsers$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res.success && res.data) {
        this.users.set(res.data);
        this.selectedUser.set(res.data[1]);
      }
      this.loaded.set(true);
    })
  }

  switchUser() {
    this.selectedUser.set(this.users().find((u) => u.userId !== this.selectedUser()?.userId)!)
  }
}
