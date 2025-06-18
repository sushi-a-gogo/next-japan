import { Component } from '@angular/core';
import { ColorBarComponent } from "./color-bar/color-bar.component";
import { UserNavbarComponent } from "./user-navbar/user-navbar.component";

@Component({
  selector: 'app-header',
  imports: [UserNavbarComponent, ColorBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
}
