import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '@core/services/meta.service';

@Component({
  selector: 'app-acceptable-use',
  imports: [],
  templateUrl: './acceptable-use.component.html',
  styleUrl: './acceptable-use.component.scss'
})
export class AcceptableUseComponent {
  private title = inject(Title);
  private meta = inject(MetaService);

  constructor() {
    this.title.setTitle('Next Japan Acceptable Use Policy');

    // Set meta tags
    const description = 'Read the Acceptable Use Policy for Next Japan, outlining permitted and prohibited activities on the platform.';
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
