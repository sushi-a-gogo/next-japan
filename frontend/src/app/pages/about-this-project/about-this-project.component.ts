import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MetaService } from '@app/services/meta.service';

@Component({
  selector: 'app-about-this-project',
  imports: [RouterLink],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AboutThisProjectComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);

  ngOnInit(): void {
    this.title.setTitle('About Next Japan');

    // Set meta tags
    const description = 'Learn about the vision, technology, and developer behind the Next Japan project.';
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
