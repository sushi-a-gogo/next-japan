import { afterNextRender, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "@app/components/footer/footer.component";
import { catchError, exhaustMap, of, timer } from 'rxjs';
import { LoginComponent } from "./auth/login/login.component";
import { AboutComponent } from "./components/about/about.component";
import { ErrorBarComponent } from "./components/error-bar/error-bar.component";
import { HeaderComponent } from './components/header/header.component';
import { PageErrorComponent } from "./components/page-error/page-error.component";
import { SpinUpComponent } from "./components/spin-up/spin-up.component";
import { ApiSpinUpService } from './services/api-spinup.service';
import { AuthMockService } from './services/auth-mock.service';
import { EventSearchService } from './services/event-search.service';
import { UserProfileService } from './services/user-profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoginComponent, ErrorBarComponent, AboutComponent, SpinUpComponent, FooterComponent, PageErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'next-japan';

  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private spinUp = inject(ApiSpinUpService);

  private authService = inject(AuthMockService);
  isAuthenticating = this.authService.isAuthenticating;

  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  ready = signal(false);
  broken = signal(false);

  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(this.configureAppHeight);
  }

  ngOnInit(): void {
    timer(0, 840000).pipe(
      exhaustMap(() => this.spinUp.ping$()),
      catchError((errorResp) => {
        console.error(errorResp);
        return of(errorResp);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((resp) => {
      this.ready.set(resp?.ok);
      this.broken.set(0 === resp?.status);
    });
  }

  toggleSearchMode() {
    this.eventSearch.toggleSearchMode();
  }

  private configureAppHeight(): void {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', appHeight);
    appHeight();
  }
}
