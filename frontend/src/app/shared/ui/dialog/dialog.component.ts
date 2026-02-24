import { Component, computed, DestroyRef, HostListener, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { UiService } from '@app/core/services/ui.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private uiService = inject(UiService);

  close = output<boolean>();

  showBackdrop = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg' | 'auto'>();
  cssClass = computed(() => this.size() ? `dialog ${this.size()}` : 'dialog');

  ngOnInit(): void {
    this.uiService.lockWindowScroll();

    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.onClose();
      });
  }

  ngOnDestroy(): void {
    this.uiService.unlockWindowScroll();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  onClick($event: any) {
    $event.stopPropagation()
  }

  onClose() {
    this.close.emit(true);
  }
}
