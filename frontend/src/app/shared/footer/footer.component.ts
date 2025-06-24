import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DialogService } from '@app/services/dialog.service';
import { AppLogoComponent } from "../app-logo/app-logo.component";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AppLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);

  openAboutDialog($event: any) {
    $event.preventDefault();
    this.dialogService.showAboutDialog();
  }
}
