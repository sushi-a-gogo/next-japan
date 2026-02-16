import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@app/core/auth/auth.service';
import { ShareService } from '@app/features/events/services/share.service';
import { DateTimeService } from '@core/services/date-time.service';
import { environment } from '@environments/environment';
import { EventData } from '@events/models/event-data.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-share-button',
  imports: [MatButtonModule, MatRippleModule, MatMenuModule, MatTooltipModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss'
})
export class ShareButtonComponent implements OnInit {
  private auth = inject(AuthService);
  private dateTime = inject(DateTimeService);
  private shareService = inject(ShareService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  event = input.required<EventData>();
  color = input<string>();

  shareCount = signal<number>(0);
  count = computed(() => this.shareCount() + this.uniqueNum());
  loaded = signal<boolean>(false);

  shareUrl = signal('');
  twitterUrl = signal('');

  userId = computed(() => this.auth.user()?.userId);
  navigatorShare = computed(() => isPlatformBrowser(this.platformId) ? !!navigator.share : false);

  private uniqueNum = signal<number>(0);

  ngOnInit(): void {
    this.shareUrl.set(`${environment.baseUrl}/event/${this.event().eventId}`);
    this.twitterUrl.set(
      `https://x.com/intent/tweet?text=${encodeURIComponent(this.event().eventTitle)}&url=${encodeURIComponent(this.shareUrl())}`
    );

    // Fetch initial share count
    const observables = {
      shareCount: this.shareService.getShareCount$(this.event().eventId),
      uniqueNum: this.getUniqueNumberFromString(this.event().eventId, this.event().createdAt),
    };
    forkJoin(observables).subscribe({
      next: (res) => {
        this.shareCount.set(res.shareCount.data?.shareCount || 0);
        this.uniqueNum.set(res.uniqueNum);
        this.loaded.set(true);
      },
      error: (error) => console.error(error),
    });
  }

  logShare() {
    this.shareService.logShare$(this.userId() || 'anonymous-user', this.event().eventId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => this.shareCount.set(res.data?.shareCount || this.shareCount()),
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

  private async getUniqueNumberFromString(inputString: string, createdAt: string) {
    const days = this.dateTime.getDaysSince(createdAt);
    if (days === 0) {
      return 0;
    }

    // Encode the input string to an array of UTF-8 bytes.
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    // Compute the SHA-256 hash.
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the ArrayBuffer hash to a hexadecimal string.
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Convert the hexadecimal string to a BigInt.
    const bigInt = BigInt(`0x${hexHash}`);
    if (days < 4) {
      return Number(bigInt.toString().substring(0, 1));
    }
    return Number(bigInt.toString().substring(0, 2));
  }
}
