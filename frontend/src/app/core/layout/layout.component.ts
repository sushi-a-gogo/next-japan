
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { ModalComponent } from "@app/shared/ui/modal/modal.component";
import { filter } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SignInBannerComponent } from './sign-in-banner/sign-in-banner.component';

@Component({
  selector: 'app-layout',
  imports: [NgComponentOutlet, AsyncPipe, HeaderComponent, FooterComponent, SignInBannerComponent, ModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  dialogService = inject(DialogService);

  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated;

  constructor(router: Router) {
    router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.eventSearch.clearSearchMode();
    });
  }

  toggleSearchMode() {
    this.eventSearch.toggleSearchMode();
  }
}
