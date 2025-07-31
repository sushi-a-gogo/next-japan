import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import fadeIn from '@app/animations/fadeIn.animation';
import { AuthMockService } from '@app/services/auth-mock.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { environment } from '@environments/environment';
import { delay } from 'rxjs';

@Component({
  selector: 'app-logout',
  imports: [MatProgressSpinnerModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  animations: [fadeIn],
  host: { '[@fadeIn]': 'in' }
})
export class LogoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.route.queryParams.pipe(
      delay(1500), // simulate a logout process
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params) => {
      const returnUrl = encodeURIComponent(params['returnTo'] ? params['returnTo'] : environment.baseUrl);
      this.userService.clearUserProfile();
      this.auth.logout(returnUrl);
    });
  }

}
