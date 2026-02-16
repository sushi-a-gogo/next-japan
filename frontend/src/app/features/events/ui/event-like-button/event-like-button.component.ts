import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '@app/core/auth/auth.service';
import { LikeService } from '@app/features/events/services/like.service';
import { DateTimeService } from '@core/services/date-time.service';
import { EventData } from '@features/events/models/event-data.model';
import { finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-event-like-button',
  imports: [MatRippleModule],
  templateUrl: './event-like-button.component.html',
  styleUrl: './event-like-button.component.scss'
})
export class EventLikeButtonComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private auth = inject(AuthService);
  private dateTime = inject(DateTimeService);
  private likeService = inject(LikeService);

  event = input.required<EventData>();
  likeCount = signal<number>(0);
  likedByCurrent = signal<boolean>(false);
  color = input<string>();
  loaded = signal<boolean>(false);

  count = computed(() => this.likeCount() + this.uniqueNum());
  userId = computed(() => this.auth.user()?.userId);
  disabled = computed(() => !this.userId());
  busy = signal<boolean>(false);

  private uniqueNum = signal<number>(0);

  ngOnInit(): void {
    const eventId = this.event().eventId;
    const observables = {
      likeCount: this.likeService.getLikeCount$(eventId),
      uniqueNum: this.getUniqueNumberFromString(eventId, this.event().createdAt),
      likedByUser: this.userId() ? this.likeService.isLikedByUser$(this.userId()!, eventId) : of(null)
    };
    forkJoin(observables).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.uniqueNum.set(res.uniqueNum);
      this.likeCount.set(res.likeCount.data?.likeCount || 0);
      this.likedByCurrent.set(!!res.likedByUser?.data?.likedByUser);
      this.loaded.set(true);
    });
  }

  like() {
    if (this.disabled() || this.busy()) return;

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
      return Number(bigInt.toString().substring(0, 2));
    }
    return Number(bigInt.toString().substring(0, 3));
  }
}
