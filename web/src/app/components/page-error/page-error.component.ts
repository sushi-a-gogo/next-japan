import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-error',
  imports: [RouterLink],
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.scss'
})
export class PageErrorComponent {
  @Input() errorTitle = 'Page not available.';
  @Input() errorMessage = `We're sorry. The requested page could not be loaded.`;
  @Input() routerLink?: string;
  @Input() routerLinkText?: string;

}
