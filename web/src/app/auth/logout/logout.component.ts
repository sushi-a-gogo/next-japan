import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-logout',
  imports: [LoadingSpinnerComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthMockService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const returnUrl = encodeURIComponent(params['returnTo'] ? params['returnTo'] : window.location.origin);
      this.auth.logout(returnUrl);
    });
  }

}
