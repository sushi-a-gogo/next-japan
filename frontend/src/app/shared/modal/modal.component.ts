import { Component, DestroyRef, HostListener, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { UiService } from '@app/services/ui.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private uiService = inject(UiService);

  open = signal<boolean>(false);
  close = output<boolean>();

  dynamicWidth = input<boolean>(false);
  showBackdrop = input<boolean>(true);

  private initialized = false;
  private scrollPosition = 0;

  constructor() {
    setTimeout(() => {
      this.open.set(true);
    }, 10);
  }

  ngOnInit(): void {
    // janky on iPad because of course it is.
    this.uiService.lockWindowScroll();

    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (this.initialized) {
          this.onClose();
        }
      });

    setTimeout(() => {
      this.initialized = true;
    }, 250)
  }

  ngOnDestroy(): void {
    // janky on iPad because of course it is.
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
