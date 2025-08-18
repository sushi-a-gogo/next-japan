import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

export const LOCAL_STORAGE_USER_KEY = 'nextjp.userid';
export const LOCAL_STORAGE_STATUS_KEY = 'nextjp.visited';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _local: Storage;
  private _session: Storage;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._local = localStorage;
      this._session = sessionStorage;
    } else {
      this._local = {
        length: 0,
        clear: () => { },
        getItem: () => null,
        key: () => null,
        removeItem: () => { },
        setItem: () => { }
      };
      this._session = {
        ...this._local
      }
    }
  }

  get local() {
    return this._local;
  }

  get session() {
    return this._session;
  }
}
