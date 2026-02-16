import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '@core/services/meta.service';

@Component({
  selector: 'app-terms-of-service',
  imports: [],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.scss'
})
export class TermsOfServiceComponent {
  private title = inject(Title);
  private meta = inject(MetaService);

  constructor() {
    this.title.setTitle('Next Japan Terms of Service');

    // Set meta tags
    const description = 'Read the Terms of Service for Next Japan, outlining the rules, responsibilities, and conditions for using the platform.';
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
