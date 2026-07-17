import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '@app/core/services/meta.service';

@Component({
  selector: 'app-acceptable-use',
  imports: [],
  templateUrl: './acceptable-use.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
