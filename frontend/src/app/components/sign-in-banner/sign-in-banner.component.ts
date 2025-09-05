import { afterNextRender, ChangeDetectionStrategy, Component, HostBinding, inject, input, OnChanges, SimpleChanges } from '@angular/core';
import { LOCAL_STORAGE_USER_KEY, StorageService } from '@app/services/storage.service';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';

@Component({
  selector: 'app-sign-in-banner',
  imports: [LoginButtonComponent],
  templateUrl: './sign-in-banner.component.html',
  styleUrl: './sign-in-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInBannerComponent implements OnChanges {
  @HostBinding('class.removed') removed = true;
  remove = input<boolean>(false);

  private storage = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      this.removed = !!this.storage.local.getItem(LOCAL_STORAGE_USER_KEY);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['remove'];
    if (change && !change.firstChange) {
      this.removed = changes['remove']?.currentValue || false;
    }
  }
}
