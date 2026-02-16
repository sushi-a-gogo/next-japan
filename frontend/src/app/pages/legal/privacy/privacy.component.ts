import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '@app/core/services/meta.service';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  private title = inject(Title);
  private meta = inject(MetaService);

  constructor() {
    this.title.setTitle('Next Japan Privacy Policy');

    // Set meta tags
    const description = 'Read the Privacy Policy for Next Japan, explaining how your data is collected, used, and protected on the platform.';
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
