import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { DreamHeaderComponent } from "@app/pages/dream/components/dream-banner/dream-header/dream-header.component";
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { AiService } from '@app/services/ai.service';
import { EventsService } from '@app/services/events.service';

@Component({
  selector: 'app-ai-event',
  imports: [RouterLink, MatProgressBarModule, DreamHeaderComponent],
  templateUrl: './ai-event.component.html',
  styleUrl: './ai-event.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
  host: { '[@fadeIn]': '' }
})
export class AiEventComponent implements OnInit {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private aiService = inject(AiService);
  private eventsService = inject(EventsService);
  private destroyRef = inject(DestroyRef);

  busy = signal<boolean>(false);

  dreamEvent = this.aiService.aiEvent;
  savedEvent = signal<AiEvent | null>(null);


  backgroundImage = computed(() => {
    return `url('${this.dreamEvent()?.imageUrl}')`;
  });

  ngOnInit(): void {
    this.title.setTitle('Next Japan AI Event');

    // Set meta tags
    const description = 'This page presents AI generated event details.';
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: this.title.getTitle() });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
  }

  reset() {
    this.router.navigate(['../dream']);
  }

  saveEvent() {
    this.busy.set(true);
    this.eventsService.saveEvent$(this.dreamEvent()!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log('Saved:', res.data);
        this.savedEvent.set(res.data); // Update with Cloudflare URL
      },
      error: () => this.busy.set(false),
      complete: () => this.busy.set(false)
    });
  }
}

