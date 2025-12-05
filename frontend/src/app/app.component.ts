import { afterNextRender, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';
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
      this.themeService.setAppearance();
    });

    interval(30000).pipe(takeUntilDestroyed()).subscribe(() => this.themeService.manageAppearance());
  }
}
