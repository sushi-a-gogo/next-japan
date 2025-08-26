import { Component, input, OnInit, signal } from '@angular/core';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-profile-badges',
  imports: [],
  templateUrl: './profile-badges.component.html',
  styleUrl: './profile-badges.component.scss'
})
export class ProfileBadgesComponent implements OnInit {
  user = input.required<User>();
  eventRegistrationCount = input.required<number>();

  badges = signal([
    { name: 'Explorer', icon: 'rocket', earned: true },
  ]);

  ngOnInit(): void {
    this.badges.update((prev) => {
      const next =
        [
          ...prev,
          { name: 'Newbie', icon: 'bedroom_baby', earned: !this.user().image.id && this.eventRegistrationCount() === 0 },
          { name: 'Profile Pro', icon: 'star_shine', earned: !!this.user().image.id },
          { name: 'Japan Lover', icon: 'favorite', earned: this.eventRegistrationCount() > 0 }
        ];
      return next.filter((badge) => badge.earned);
    })
  }
}
