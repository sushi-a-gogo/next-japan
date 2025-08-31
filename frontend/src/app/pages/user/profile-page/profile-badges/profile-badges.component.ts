import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, input, OnChanges, OnInit, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserReward } from '@app/models/user-reward.model';
import { User } from '@app/models/user.model';
import { DateTimeService } from '@app/services/date-time.service';
import { UserProfileService } from '@app/services/user-profile.service';

@Component({
  selector: 'app-profile-badges',
  imports: [DatePipe, MatTableModule, MatTooltipModule],
  templateUrl: './profile-badges.component.html',
  styleUrl: './profile-badges.component.scss'
})
export class ProfileBadgesComponent implements OnInit, OnChanges {
  private dateTime = inject(DateTimeService);
  private userService = inject(UserProfileService)

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('badgeContainer') badgeContainer!: ElementRef;
  user = input.required<User>();
  eventRegistrationCount = input.required<number>();
  animationState = signal('out');
  loaded = signal<boolean>(false);


  badges = signal([
    { name: 'Explorer', icon: 'rocket', tooltip: '', earned: true },
  ]);

  displayedColumns: string[] = ['pointsEarned', 'pointsRemaining', 'dateOfIssue', 'expiration', 'description'];
  rewards = signal<UserReward[]>([]);
  rewardPoints = 0;

  ngOnInit(): void {
    this.userService.getUserRewards$(this.user().userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((resp) => {
      const rewards = resp.data.map((reward) => {
        this.rewardPoints += reward.pointsRemaining;
        return ({
          ...reward,
          expiresSoon: this.dateTime.getDaysUntil(reward.expiration) < 90
        });
      }).sort((a, b) => new Date(a.expiration).getTime() - new Date(b.expiration).getTime());
      this.rewards.set(rewards);
      this.loaded.set(true);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['user'] || changes['eventRegistrationCount'];
    if (!changed) return;

    let animate = false;
    this.badges.update((prev) => {
      const items =
        [
          { name: 'Explorer', icon: 'rocket', tooltip: 'You earned this badge by starting a subscription!', earned: true },
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
    });
  }

}
