import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageErrorComponent } from '@app/pages/not-found/page-error/page-error.component';
import { ErrorService } from '@core/services/error.service';

@Component({
  selector: 'app-not-found',
  imports: [PageErrorComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class NotFoundComponent {
  private errorService = inject(ErrorService);
  errorMessage = computed(() => this.errorService.errorMessage() || "We're sorry. The requested page was not found.");
}
