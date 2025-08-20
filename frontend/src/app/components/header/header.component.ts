import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthMockService } from '@app/services/auth-mock.service';
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
  private authService = inject(AuthMockService);
  isAuthenticated = this.authService.isAuthenticated;
  user = this.authService.user;
}
