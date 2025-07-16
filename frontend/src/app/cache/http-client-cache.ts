import { Observable } from "rxjs";

export class HttpClientCache<T> {
  private cache = new Map<string, Observable<T>>();
  private cacheTime = 0;

  constructor(private timeoutInMinutes: number = 1) {
  }

  get(key: string): Observable<T> | undefined {
    return this.cache.get(key);
  }

  set(key: string, obs$: Observable<T>) {
    this.cache.set(key, obs$);
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  existsInCache(key: string) {
    const ageOfCacheInMilliseconds = new Date().getTime() - this.cacheTime;
    if (ageOfCacheInMilliseconds > 1000 * 60 * this.timeoutInMinutes) {
      this.cache.clear();
      this.cacheTime = new Date().getTime();
    }

    return this.cache.has(key);
  }
}
