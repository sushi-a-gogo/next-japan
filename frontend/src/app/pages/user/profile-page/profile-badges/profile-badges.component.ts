import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-profile-badges',
  imports: [],
  templateUrl: './profile-badges.component.html',
  styleUrl: './profile-badges.component.scss'
})
export class ProfileBadgesComponent {
  badges = signal([
    { name: 'Event Explorer', icon: 'award_star', earned: true },
    { name: 'Profile Pro', icon: 'check', earned: true },
    { name: 'Japan Lover', icon: 'favorite', earned: true }
  ]);
}
