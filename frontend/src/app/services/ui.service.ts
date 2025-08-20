import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private platformId = inject(PLATFORM_ID);
  private scrollPosition = 0;

  lockWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollPosition = window.scrollY; // Store the current scroll position
      document.body.classList.add('overflow-clip');
      document.body.style.top = `-${this.scrollPosition}px`; // Apply negative top to maintain position
    }
  }

  unlockWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('overflow-clip');
      document.body.style.top = ''; // Remove the fixed position
      window.scrollTo(0, this.scrollPosition); // Restore the scroll position
    }
  }
}
