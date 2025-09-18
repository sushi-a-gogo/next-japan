import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';

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
export class SignInBannerComponent implements OnChanges {
  private auth = inject(AuthService);

  remove = input<boolean>(false);
  isRemoved = signal<boolean>(false);
  visible = computed(() => this.auth.loginStatus() === 'idle');

  constructor() {
    afterNextRender(() => {
      this.isRemoved.set(!!this.auth.user());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['remove'];
    if (change && !change.firstChange) {
      this.isRemoved.set(change.currentValue || false);
    }
  }
}
