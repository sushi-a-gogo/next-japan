import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'rxjs';

@Component({
  selector: 'app-logout',
  imports: [MatProgressSpinnerModule, NgxSpinnerComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  host: { '[class.fade-in-animate]': 'true' }
})
export class LogoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private spinner = inject(NgxSpinnerService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.spinner.show();
    this.route.queryParams.pipe(
      delay(1500), // simulate a logout process
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) => {
      const returnUrl = encodeURIComponent(params['returnTo'] ? params['returnTo'] : '');
      this.auth.logout(returnUrl);
    });
  }

}
