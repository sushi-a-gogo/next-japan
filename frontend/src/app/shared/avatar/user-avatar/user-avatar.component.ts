import { Component, computed, input } from '@angular/core';
import { User } from '@app/models/user.model';
import { AvatarComponent } from "../avatar.component";

@Component({
  selector: 'app-user-avatar',
  imports: [AvatarComponent],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  user = input.required<User>();
  size = input<number>(33);

  initials = computed(() => this.user().firstName.slice(0, 1) + this.user().lastName.slice(0, 1));

  styleCss = computed(() => ({
    width: `${this.size()}px`,
    height: `${this.size()}px`,
  }));

}
