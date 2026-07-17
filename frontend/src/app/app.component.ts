import { afterNextRender, Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';
import { VisitTrackerComponent } from "./core/analytics/visit-tracker/visit-tracker.component";
import { ThemeService } from './core/services/theme.service';
import { ErrorBarComponent } from "./core/ui/error-bar/error-bar.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ErrorBarComponent,
    VisitTrackerComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
