import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '@core/services/meta.service';

@Component({
  selector: 'app-cookie-policy',
  imports: [],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.scss'
})
export class CookiePolicyComponent {
  private title = inject(Title);
  private meta = inject(MetaService);

  constructor() {
    const title = 'Next Japan Cookie Policy';

    // Set meta tags
    const description = 'Read the Cookie Policy for Next Japan, explaining how cookies are used and managed on the platform.';
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
