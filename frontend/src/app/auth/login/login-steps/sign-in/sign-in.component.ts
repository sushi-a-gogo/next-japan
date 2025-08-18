import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '@app/models/user.model';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from '@app/shared/avatar/user-avatar/user-avatar.component';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, UserAvatarComponent],
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
    this.userService.getUsers$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((resp) => {
      this.users.set(resp.data);
      this.selectedUser.set(resp.data[1]);
      this.loaded.set(true);
    })
  }

  switchUser() {
    this.selectedUser.set(this.users().find((u) => u.userId !== this.selectedUser()?.userId)!)
  }
}
