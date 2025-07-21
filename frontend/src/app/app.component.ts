import { afterNextRender, Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "@app/components/footer/footer.component";
import { LoginComponent } from "./auth/login/login.component";
import { AboutComponent } from "./components/about/about.component";
import { ErrorBarComponent } from "./components/error-bar/error-bar.component";
import { HeaderComponent } from './components/header/header.component';
import { MyEventsComponent } from "./components/my-events/my-events.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { AuthMockService } from './services/auth-mock.service';
import { DialogService } from './services/dialog.service';
import { EventSearchService } from './services/event-search.service';
import { UserProfileService } from './services/user-profile.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    LoginComponent,
    ErrorBarComponent,
    AboutComponent,
    FooterComponent,
    MyEventsComponent,
    UserProfileComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'next-japan';

  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private authService = inject(AuthMockService);
  isAuthenticating = this.authService.isAuthenticating;

  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  private dialogService = inject(DialogService);
  showEventsDialog = computed(() => this.dialogService.showDialog() === 'events');
  showProfileDialog = computed(() => this.dialogService.showDialog() === 'profile');

  constructor() {
    afterNextRender(this.configureAppHeight);
  }

  ngOnInit(): void {
  }

  toggleSearchMode() {
    this.eventSearch.toggleSearchMode();
  }


  closeEventsDialog() {
    this.dialogService.closeDialog('events');
  }

  closeProfileDialog() {
    this.dialogService.closeDialog('profile');
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
