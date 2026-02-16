import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, computed, DestroyRef, ElementRef, inject, input, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '@app/core/models/user.model';
import { DateTimeService } from '@app/core/services/date-time.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { UserReward } from '@app/features/user/models/user-reward.model';
import { UserProfileService } from '@app/features/user/services/user-profile.service';

@Component({
  selector: 'app-profile-badges',
  imports: [DatePipe, MatTableModule, MatTooltipModule],
  templateUrl: './profile-badges.component.html',
  styleUrl: './profile-badges.component.scss'
})
export class ProfileBadgesComponent implements OnInit {
  private dateTime = inject(DateTimeService);
  private registrationService = inject(EventRegistrationService);
  private userService = inject(UserProfileService)

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('badgeContainer') badgeContainer!: ElementRef;
  user = input.required<User>();
  animationState = signal('out');
  loaded = signal<boolean>(false);


  badges = [
    { name: 'Explorer', icon: 'rocket', tooltip: '', earned: true },
  ];

  earnedBadges = computed(() => {
    const eventRegistrationCount = this.registrationService.userEventRegistrations()?.length || 0;
    const items =
      [
        { name: 'Explorer', icon: 'rocket', tooltip: 'You earned this badge by starting a subscription!', earned: true },
        { name: 'Newbie', icon: 'bedroom_baby', tooltip: '', earned: !this.user().image.id && eventRegistrationCount === 0 },
        { name: 'Profile Pro', icon: 'star_shine', tooltip: 'You completed your profile to earn this badge!', earned: !!this.user().image.id },
        { name: 'Japan Lover', icon: 'favorite', tooltip: 'You attended more than 5 events to earn this badge!', earned: eventRegistrationCount > 0 }
      ];

    const earned = items.filter((badge) => badge.earned);
    return earned;
  });

  displayedColumns: string[] = ['mobile', 'pointsEarned', 'pointsRemaining', 'dateOfIssue', 'expiration', 'description'];
  rewards = signal<UserReward[]>([]);
  rewardPoints = 0;

  ngOnInit(): void {
    this.userService.getUserRewards$(this.user().userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res.success && res.data) {
        const rewards = res.data.map((reward) => {
          this.rewardPoints += reward.pointsRemaining;
          return ({
            ...reward,
            expiresSoon: this.dateTime.getDaysUntil(reward.expiration) < 90
          });
        }).sort((a, b) => new Date(a.expiration).getTime() - new Date(b.expiration).getTime());
        this.rewards.set(rewards);
      }
      this.loaded.set(true);
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animateIn();
    }
  }

  private animateIn() {
    const items = this.badgeContainer.nativeElement.querySelectorAll('.badge-card');
    requestAnimationFrame(() => {
      this.animationState.set('in');
      this.cdr.markForCheck();
      // Force repaint
      requestAnimationFrame(() => {
        items.forEach((item: HTMLElement, index: number) => {
          const computedStyle = window.getComputedStyle(item);
          item.style.transform = 'scale(1.0001)';
          item.style.transform = '';
        });
      });
    });
  }

}
