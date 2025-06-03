import { Component, HostListener, output, signal } from '@angular/core';
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
export class ModalComponent {
  open = signal<boolean>(false);
  close = output<boolean>();

  constructor(router: Router) {
    setTimeout(() => {
      this.open.set(true);
    }, 10);

    router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      takeUntilDestroyed()).subscribe(() => this.onClose());
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
