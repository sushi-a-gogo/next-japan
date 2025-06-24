import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavbarComponent } from "@app/components/navbar/navbar.component";
import { AuthMockService } from '@app/services/auth-mock.service';
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-about-this-project',
  imports: [NgOptimizedImage, NavbarComponent, FooterComponent],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss'
})
export class AboutThisProjectComponent {
  private auth = inject(AuthMockService);
  isAuthenticated = this.auth.isAuthenticated;
}
