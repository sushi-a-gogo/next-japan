import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-profile-badges',
  imports: [],
  templateUrl: './profile-badges.component.html',
  styleUrl: './profile-badges.component.scss'
})
export class ProfileBadgesComponent implements OnChanges {
  @ViewChild('badgeContainer') badgeContainer!: ElementRef;
  user = input.required<User>();
  eventRegistrationCount = input.required<number>();
  animationState = signal('out');

  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);
  private cdr = inject(ChangeDetectorRef);

  badges = signal([
    { name: 'Explorer', icon: 'rocket', earned: true },
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['user'] || changes['eventRegistrationCount'];
    if (!changed) return;

    let animate = false;
    this.badges.update((prev) => {
      const items =
        [
          { name: 'Explorer', icon: 'rocket', earned: true },
          { name: 'Newbie', icon: 'bedroom_baby', earned: !this.user().image.id && this.eventRegistrationCount() === 0 },
          { name: 'Profile Pro', icon: 'star_shine', earned: !!this.user().image.id },
          { name: 'Japan Lover', icon: 'favorite', earned: this.eventRegistrationCount() > 0 }
        ];
      const next = items.filter((badge) => badge.earned);
      animate = next.map((b) => b.icon).join() !== prev.map((b) => b.icon).join();
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
