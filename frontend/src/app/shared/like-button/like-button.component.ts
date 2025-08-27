import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthMockService } from '@app/services/auth-mock.service';
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
  private likeService = inject(LikeService);

  eventId = input.required<string>();
  colorHex = input<string>();
  count = signal<number>(0);
  likedByCurrent = signal<boolean>(false);

  userId = computed(() => this.auth.user()?.userId);

  ngOnInit(): void {
    const observables = {
      likeCount: this.likeService.getLikeCount$(this.eventId()),
      likedByUser: this.userId() ? this.likeService.isLikedByUser$(this.userId()!, this.eventId()) : of(null)
    }
    forkJoin(observables).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.count.set(res.likeCount.data.likeCount);
      this.likedByCurrent.set(!!res.likedByUser?.data.liked);
    });
  }

  like() {
    const liked = !this.likedByCurrent();
    this.likeService.toggleLike$(this.userId()!, this.eventId(), liked).pipe(
      takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.count.set(res.data.likeCount);
          this.likedByCurrent.set(liked);
        },
        error: () => { }
      });
  }
}
