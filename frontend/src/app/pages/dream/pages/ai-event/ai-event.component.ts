import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { DreamHeaderComponent } from "@app/pages/dream/pages/ai-event/dream-header/dream-header.component";
import { EventData } from '@app/pages/event/models/event-data.model';
import { AiService } from '@app/services/ai.service';
import { EventsService } from '@app/services/events.service';
import { MetaService } from '@app/services/meta.service';
import { filter } from 'rxjs';

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
  private meta = inject(MetaService);
  private aiService = inject(AiService);
  private eventsService = inject(EventsService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  busy = signal<boolean>(false);

  dreamEvent = this.aiService.aiEvent;
  savedEvent = signal<EventData | null>(null);


  backgroundImage = computed(() => {
    return `url('${this.dreamEvent()?.imageUrl}')`;
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
    this.router.navigate(['../dream']);
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
      verticalPosition: 'bottom',
      panelClass: 'success-bar'
    }).afterDismissed().subscribe();
  }
}

