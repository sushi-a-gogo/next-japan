import { afterNextRender, ChangeDetectionStrategy, Component, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { LOCAL_STORAGE_USER_KEY, StorageService } from '@app/services/storage.service';
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
  remove = input<boolean>(false);
  isRemoved = signal<boolean>(false);

  private storage = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      this.isRemoved.set(!!this.storage.local.getItem(LOCAL_STORAGE_USER_KEY));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['remove'];
    if (change && !change.firstChange) {
      this.isRemoved.set(change.currentValue || false);
    }
  }
}
