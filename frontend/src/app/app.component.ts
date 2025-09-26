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
    const calcAppHeight = () => {
      console.log("calcAppHeight");
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', calcAppHeight);
    window.addEventListener('focusout', () => {
      setTimeout(calcAppHeight, 100); // small delay to allow viewport to settle
    });

    calcAppHeight();
  }
}
