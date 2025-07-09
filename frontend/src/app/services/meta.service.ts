import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private meta = inject(Meta);
  private router = inject(Router);

  updateTag(tag: MetaDefinition) {
    this.meta.updateTag(tag);
  }

  updateTags(title: string, description: string) {
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });

    const url = `${environment.baseUrl}${this.router?.url}`;
    this.meta.updateTag({ property: 'og:url', content: url });
  }
}
