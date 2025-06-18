import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;
    } else {
      this.storage = {
        length: 0,
        clear: () => { },
        getItem: () => null,
        key: () => null,
        removeItem: () => { },
        setItem: () => { }
      };
    }
  }

  getItem(key: string): string | null {
    return this.storage?.getItem(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage?.setItem(key, value);
  }

  removeItem(key: string): void {
    this.storage?.removeItem(key);
  }
}
