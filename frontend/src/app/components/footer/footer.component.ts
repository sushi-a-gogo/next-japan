import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppLogoComponent } from "@shared/app-logo/app-logo.component";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AppLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
}
