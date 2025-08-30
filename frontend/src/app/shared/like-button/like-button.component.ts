import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventData } from '@app/models/event/event-data.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DateTimeService } from '@app/services/date-time.service';
import { LikeService } from '@app/services/like.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-like-button',
  imports: [MatTooltipModule],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss'
})
export class LikeButtonComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private auth = inject(AuthMockService);
  private dateTime = inject(DateTimeService);
  private likeService = inject(LikeService);

  event = input.required<EventData>();
  likeCount = signal<number>(0);
  likedByCurrent = signal<boolean>(false);
  color = input<string>();
  loaded = signal<boolean>(false);

  count = computed(() => this.likeCount() + this.uniqueNum());
  userId = computed(() => this.auth.user()?.userId);

  private uniqueNum = signal<number>(0);

  ngOnInit(): void {
    console.log(this.color());
    const eventId = this.event().eventId;
    const observables = {
      likeCount: this.likeService.getLikeCount$(eventId),
      uniqueNum: this.getUniqueNumberFromString(eventId, this.event().createdAt),
      likedByUser: this.userId() ? this.likeService.isLikedByUser$(this.userId()!, eventId) : of(null)
    };
    forkJoin(observables).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.uniqueNum.set(res.uniqueNum);
      this.likeCount.set(res.likeCount.data.likeCount);
      this.likedByCurrent.set(!!res.likedByUser?.data.liked);
      this.loaded.set(true);
    });
  }

  like() {
    const liked = !this.likedByCurrent();
    this.likeService.toggleLike$(this.userId()!, this.event().eventId, liked).pipe(
      takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.likeCount.set(res.data.likeCount);
          this.likedByCurrent.set(liked);
        },
        error: () => { }
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
