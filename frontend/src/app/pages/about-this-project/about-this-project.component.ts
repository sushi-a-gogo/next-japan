import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CanonicalService } from '@core/services/canonical.service';
import { MetaService } from '@core/services/meta.service';
import { MyResumeComponent } from "./my-resume/my-resume.component";

@Component({
  selector: 'app-about-this-project',
  imports: [RouterLink, MatButtonModule, MyResumeComponent],
  templateUrl: './about-this-project.component.html',
  styleUrl: './about-this-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.fade-in-animate]': 'true' }
})
export class AboutThisProjectComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(MetaService);
  private route = inject(ActivatedRoute);
  private canonicalService = inject(CanonicalService);

  viewResume = signal(false);

  ngOnInit(): void {
    this.canonicalService.setCanonicalURL(this.route.snapshot.data['canonicalPath'] || '/about-this-project');
    this.title.setTitle('About Next Japan');

    // Set meta tags
    const description = 'Learn about the vision, technology, and developer behind the Next Japan project.';
    this.meta.updateTags(this.title.getTitle(), description);
  }

  openResume(e: any) {
    e.preventDefault();
    this.viewResume.set(true);
    return false;
  }
}
