import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBarComponent } from "./components/error-bar/error-bar.component";
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ErrorBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Next Japan';
  private themeService = inject(ThemeService);

  constructor() {
    afterNextRender(() => {
      this.configureAppHeight();
      this.themeService.setAppearanceMode();
    });
  }

  private configureAppHeight(): void {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    const isIosSafari = /iP(ad|hone|od)/.test(navigator.userAgent) &&
      /WebKit/.test(navigator.userAgent) &&
      !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

    if (isIosSafari) {
      document.body.classList.add('ios-safari');
    }

    window.addEventListener('resize', appHeight);
    appHeight();
  }
}
