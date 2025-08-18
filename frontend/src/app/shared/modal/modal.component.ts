import { Component, DestroyRef, HostListener, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  open = signal<boolean>(false);
  close = output<boolean>();

  dynamicWidth = input<boolean>(false);
  showBackdrop = input<boolean>(true);

  private initialized = false;
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    setTimeout(() => {
      this.open.set(true);
    }, 10);
  }

  ngOnInit(): void {
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
