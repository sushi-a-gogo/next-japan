import { animate, style, transition, trigger } from '@angular/animations';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { AiEventHeaderComponent } from "@app/pages/ai/ai-event-page/ai-event-header/ai-event-header.component";
import { AiService } from '@app/services/ai.service';
import { EventsService } from '@app/services/events.service';
import { MetaService } from '@app/services/meta.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-ai-event-page',
  imports: [NgOptimizedImage, RouterLink, MatProgressBarModule, AiEventHeaderComponent],
  templateUrl: './ai-event-page.component.html',
  styleUrl: './ai-event-page.component.scss',
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
export class AiEventPageComponent implements OnInit {
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(MetaService);
  private aiService = inject(AiService);
  private eventsService = inject(EventsService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  busy = signal<boolean>(false);

  dreamEvent = this.aiService.aiEvent;
  savedEvent = signal<EventData | null>(null);


  backgroundImage = computed(() => {
    return this.dreamEvent()?.imageUrl;
  });

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.snackBar.dismiss())

    this.title.setTitle('Next Japan AI Event');

    // Set meta tags
    const description = 'This page presents AI generated event details.';
    this.meta.updateTags(this.title.getTitle(), description);
  }

  reset() {
    this.router.navigate(['../ai']);
  }

  saveEvent() {
    this.busy.set(true);
    this.eventsService.saveEvent$(this.dreamEvent()!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log('Saved:', res.data);
        this.savedEvent.set(res.data); // Update with Cloudflare URL
        this.openSaveMessage();
      },
      error: () => this.busy.set(false),
      complete: () => this.busy.set(false)
    });
  }

  private openSaveMessage() {
    this.snackBar.open('🎉 Success! Your AI-powered event is now saved.', 'Awesome!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'success-bar'
    }).afterDismissed().subscribe();
  }
}

