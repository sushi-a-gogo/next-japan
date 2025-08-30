import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, computed, ElementRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '@app/models/user.model';
import { DateTimeService } from '@app/services/date-time.service';

export interface Reward {
  pointsEarned: number;
  pointsRemaining: number;
  dateOfIssue: string;
  expiration: string;
  description: string; // e.g. 'Attended weekend camping trip', 'Special End of Summer Promotion'. etc.
  expiresSoon: boolean;
}

const REWARD_DATA: Reward[] = [
  {
    pointsEarned: 100,
    pointsRemaining: 100,
    dateOfIssue: '2025-04-15T00:00:00+09:00',
    expiration: '2025-10-15T00:00:00+09:00',
    description: 'Attended weekend camping trip',
    expiresSoon: false
  },
  {
    pointsEarned: 50,
    pointsRemaining: 30,
    dateOfIssue: '2025-04-10T00:00:00+09:00',
    expiration: '2025-10-10T00:00:00+09:00',
    description: 'Special Early Spring Promotion',
    expiresSoon: false
  },
  {
    pointsEarned: 75,
    pointsRemaining: 75,
    dateOfIssue: '2025-05-05T00:00:00+09:00',
    expiration: '2025-11-30T00:00:00+09:00',
    description: 'Completed profile setup',
    expiresSoon: false
  },
  {
    pointsEarned: 120,
    pointsRemaining: 60,
    dateOfIssue: '2025-06-01T00:00:00+09:00',
    expiration: '2025-12-01T00:00:00+09:00',
    description: 'Referred a friend',
    expiresSoon: false
  },
  {
    pointsEarned: 200,
    pointsRemaining: 200,
    dateOfIssue: '2025-06-20T00:00:00+09:00',
    expiration: '2025-12-20T00:00:00+09:00',
    description: 'Attended Japan Culture Festival',
    expiresSoon: false
  }
];

@Component({
  selector: 'app-profile-badges',
  imports: [DatePipe, MatTableModule, MatTooltipModule],
  templateUrl: './profile-badges.component.html',
  styleUrl: './profile-badges.component.scss'
})
export class ProfileBadgesComponent implements OnChanges {
  @ViewChild('badgeContainer') badgeContainer!: ElementRef;
  user = input.required<User>();
  eventRegistrationCount = input.required<number>();
  animationState = signal('out');

  displayedColumns: string[] = ['pointsEarned', 'pointsRemaining', 'dateOfIssue', 'expiration', 'description'];
  dataSource = REWARD_DATA;

  private dateTime = inject(DateTimeService);

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  badges = signal([
    { name: 'Explorer', icon: 'rocket', tooltip: '', earned: true },
  ]);

  rewards = computed(() => {
    return REWARD_DATA.map((reward) => ({
      ...reward,
      expiresSoon: this.dateTime.getDaysUntil(reward.expiration) < 90
    })).sort((a, b) => new Date(a.expiration).getTime() - new Date(b.expiration).getTime())
  })

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['user'] || changes['eventRegistrationCount'];
    if (!changed) return;

    let animate = false;
    this.badges.update((prev) => {
      const items =
        [
          { name: 'Explorer', icon: 'rocket', tooltip: 'You earned this badge by creating a subscription!', earned: true },
          { name: 'Newbie', icon: 'bedroom_baby', tooltip: '', earned: !this.user().image.id && this.eventRegistrationCount() === 0 },
          { name: 'Profile Pro', icon: 'star_shine', tooltip: 'You completed your profile to earn this badge!', earned: !!this.user().image.id },
          { name: 'Japan Lover', icon: 'favorite', tooltip: 'You attended more than 5 events to earn this badge!', earned: this.eventRegistrationCount() > 0 }
        ];
      const next = items.filter((badge) => badge.earned);
      animate = !changed.firstChange && next.map((b) => b.icon).join() !== prev.map((b) => b.icon).join();
      return next;
    });

    if (isPlatformBrowser(this.platformId) && animate) {
      this.animationState.set('out');
      this.animateIn();
    }
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
      //observer?.disconnect();
    });
  }

}
