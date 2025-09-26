import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import fadeIn from '@app/animations/fadeIn.animation';
import { CanonicalService } from '@app/services/canonical.service';
import { MetaService } from '@app/services/meta.service';

@Component({
  selector: 'app-about-this-project',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  host: {
    '[@fadeIn]': 'in'
  }

})
export class AboutThisProjectComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private route = inject(ActivatedRoute);
  private canonicalService = inject(CanonicalService);

  ngOnInit(): void {
    this.canonicalService.setCanonicalURL(this.route.snapshot.data['canonicalPath'] || '/about-this-project');
    this.title.setTitle('About Next Japan');

    // Set meta tags
    const description = 'Learn about the vision, technology, and developer behind the Next Japan project.';
    this.meta.updateTags(this.title.getTitle(), description);
  }
}
