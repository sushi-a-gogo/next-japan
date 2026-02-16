import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ModalComponent } from "../modal.component";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatButtonModule, MatRippleModule, ModalComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  headerText = input<string>();
  confirmed = output<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
  }

  onDialogClose() {
    this.confirmed.emit(false);
  }
}
