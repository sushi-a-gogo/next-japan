import { Component, input, output } from '@angular/core';
import { ModalComponent } from "../modal.component";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  headerText = input<string>();
  message = input<string>();
  confirmed = output<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
  }

  onDialogClose() {
    this.confirmed.emit(false);
  }
}
