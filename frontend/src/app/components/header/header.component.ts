import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { ColorBarComponent } from "./color-bar/color-bar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { UserNavbarComponent } from "./user-navbar/user-navbar.component";

@Component({
  selector: 'app-header',
  imports: [UserNavbarComponent, ColorBarComponent, NavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HeaderComponent {
  private authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated;
  user = this.authService.user;
}
