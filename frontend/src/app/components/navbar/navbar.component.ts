import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppLogoComponent } from "@app/shared/app-logo/app-logo.component";
import { LoginButtonComponent } from "@app/shared/login-button/login-button.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AppLogoComponent, LoginButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
