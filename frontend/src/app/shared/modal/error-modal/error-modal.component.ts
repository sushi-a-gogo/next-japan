import { Component, inject, input } from '@angular/core';
import { ErrorService } from '@services/error.service';
import { ModalComponent } from "../modal.component";

@Component({
  selector: 'app-error-modal',
  standalone: true,
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
  imports: [ModalComponent]
})
export class ErrorModalComponent {
  title = input<string>();
  message = input<string>();
  private errorService = inject(ErrorService);

  onClearError() {
    this.errorService.clearError();
  }
}
