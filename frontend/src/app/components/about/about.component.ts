import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { DialogService } from '@app/services/dialog.service';
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: 'app-about',
  imports: [RouterLink, MatButtonModule, MatRippleModule, ModalComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private dialogService = inject(DialogService);

  showDialog = computed(() => {
    return this.dialogService.showDialog() === 'about';
  });

  close() {
    this.dialogService.closeDialog('about');
  }

}
