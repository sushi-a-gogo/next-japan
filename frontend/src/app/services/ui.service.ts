import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  lockWindowScroll(scrollPos: number) {
    document.body.classList.add('overflow-clip');
    document.body.style.top = `-${scrollPos}px`; // Apply negative top to maintain position
  }

  unlockWindowScroll(scrollPos: number) {
    document.body.classList.remove('overflow-clip');
    document.body.style.top = ''; // Remove the fixed position
    window.scrollTo(0, scrollPos); // Restore the scroll position
  }
}
