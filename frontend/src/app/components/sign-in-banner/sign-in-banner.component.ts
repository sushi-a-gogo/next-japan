import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnChanges, OnInit, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/services/auth.service';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-sign-in-banner',
  imports: [LoginButtonComponent],
  templateUrl: './sign-in-banner.component.html',
  styleUrl: './sign-in-banner.component.scss',
  host: {
    '[class.removed]': 'isRemoved()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInBannerComponent implements OnInit, OnChanges {
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  remove = input<boolean>(false);
  isRemoved = signal<boolean>(false);
  open = computed(() => this.auth.loginStatus() === 'idle');
  visible = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isRemoved.set(!!this.auth.user());
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll').pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        const scrolled = window.scrollY || document.documentElement.scrollTop;
        if (scrolled > 0) {
          this.visible.set(true);
        } else {
          this.visible.set(false);
        }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['remove'];
    if (change && !change.firstChange) {
      this.isRemoved.set(change.currentValue || false);
    }
  }
}
