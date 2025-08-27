import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';
import { AboutComponent } from "./components/about/about.component";
import { ErrorBarComponent } from "./components/error-bar/error-bar.component";
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ErrorBarComponent,
    AboutComponent,
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
      interval(60_000).subscribe(() => this.themeService.manageTheme());
    });
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
