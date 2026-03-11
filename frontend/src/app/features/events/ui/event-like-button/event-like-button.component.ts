import { Component, computed, DestroyRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '@app/core/auth/auth.service';
import { DateTimeService } from '@app/core/services/date-time.service';
import { EventData } from '@app/features/events/models/event-data.model';
import { LikeService } from '@app/features/events/services/like.service';
import { finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-event-like-button',
  imports: [MatRippleModule],
  templateUrl: './event-like-button.component.html',
  styleUrl: './event-like-button.component.scss'
})
export class EventLikeButtonComponent implements OnChanges {
  event = input.required<EventData>();
  color = input<string>();

  private destroyRef = inject(DestroyRef);
  private auth = inject(AuthService);
  private dateTime = inject(DateTimeService);
  private likeService = inject(LikeService);

  private userId = computed(() => this.auth.user()?.userId);

  private likeCount = signal<number>(0);
  private simulatedLikeCount = signal<number>(0);

  busy = signal<boolean>(false);
  loaded = signal<boolean>(false);
  likedByCurrent = signal<boolean>(false);

  count = computed(() => this.likeCount() + this.simulatedLikeCount());
  disabled = computed(() => !this.userId());

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['eventId']) {
      return;
    }

    const eventId = this.event().eventId;
    const userId = this.userId();

    const observables = {
      likeCount: this.likeService.getLikeCount$(eventId),
      simulatedLikeCount: this.computeSimulatedLikes(eventId, this.event().createdAt),
      likedByUser: userId ? this.likeService.isLikedByUser$(userId, eventId) : of(null)
    };
    forkJoin(observables).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.simulatedLikeCount.set(res.simulatedLikeCount);
      this.likeCount.set(res.likeCount.data?.likeCount || 0);
      this.likedByCurrent.set(!!res.likedByUser?.data?.likedByUser);
      this.loaded.set(true);
    });
  }

  like() {
    if (this.disabled() || this.busy()) {
      return;
    }

    this.busy.set(true);

    // Optimistic updates for likes
    const prevLiked = this.likedByCurrent();
    const prevCount = this.likeCount();
    const nowLiked = !prevLiked;

    this.likeCount.set(Math.max(0, nowLiked ? prevCount + 1 : prevCount - 1));
    this.likedByCurrent.set(nowLiked);

    this.likeService.toggleLike$(this.userId()!, this.event().eventId, nowLiked).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.busy.set(false)))
      .subscribe({
        next: (res) => {
          this.likeCount.set(res.data?.likeCount ?? this.likeCount());
        },
        error: () => {
          this.likeCount.set(prevCount);
          this.likedByCurrent.set(prevLiked);
        }
      });
  }

  /*
  Simulates a real world like count for an event.
  Each count is unique to the event - derived from the event id.
  */
  private async computeSimulatedLikes(eventId: string | null, createdAt: string | null) {
    if (!eventId || !createdAt) {
      return 0;
    }

    const days = this.dateTime.getDaysSince(createdAt);
    if (days === 0) {
      return 0;
    }

    // Encode the input string to an array of UTF-8 bytes.
    const encoder = new TextEncoder();
    const data = encoder.encode(eventId);

    // Compute the SHA-256 hash.
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the ArrayBuffer hash to a hexadecimal string.
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Convert the hexadecimal string to a BigInt.
    const bigInt = BigInt(`0x${hexHash}`);
    const max = days < 4 ? 100 : 1000;
    return Number(bigInt % BigInt(max));
  }
}

