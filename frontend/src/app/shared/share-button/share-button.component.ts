import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventData } from '@app/models/event/event-data.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { ShareService } from '@app/services/share.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-share-button',
  imports: [MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss'
})
export class ShareButtonComponent implements OnInit {
  private auth = inject(AuthMockService);
  private shareService = inject(ShareService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  event = input.required<EventData>();
  colorHex = input<string>();
  shareCount = signal<number>(0);
  shareUrl = signal('');
  twitterUrl = signal('');

  userId = computed(() => this.auth.user()?.userId);
  navigatorShare = computed(() => isPlatformBrowser(this.platformId) ? !!navigator.share : false);

  ngOnInit(): void {
    this.shareUrl.set(`${environment.baseUrl}/event/${this.event().eventId}`);
    this.twitterUrl.set(
      `https://x.com/intent/tweet?text=${encodeURIComponent(this.event().eventTitle)}&url=${encodeURIComponent(this.shareUrl())}`
    );

    // Fetch initial share count
    this.shareService.getShareCount$(this.event().eventId).subscribe({
      next: (response) => this.shareCount.set(response.data.shareCount),
      error: (error) => console.error(error),
    });
  }

  logShare() {
    this.shareService.logShare$(this.userId() || 'anonymous-user', this.event().eventId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (resp) => this.shareCount.set(resp.data.shareCount),
    });
  }

  async share() {
    try {
      await navigator.share({
        title: this.event().eventTitle,
        text: this.event().description,
        url: this.shareUrl()
      });
      this.logShare();
    } catch {
      console.log("Nope.")
    }
  }

  async copyLink() {
    if (isPlatformBrowser(this.platformId)) {
      await navigator.clipboard.writeText(this.shareUrl());
      this.logShare();
    }
  }

  async sendEmail() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `mailto:?subject=${encodeURIComponent(this.event().eventTitle)}&body=${encodeURIComponent(this.event().description + '\n' + this.shareUrl())}`;
      this.logShare();
    }
  }

}
