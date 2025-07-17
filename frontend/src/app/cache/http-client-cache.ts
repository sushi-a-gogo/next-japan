import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

interface CacheEntry<T> {
  observable$: Observable<T>;
  timestamp: number;
}
const SIZE_LIMIT = 50;

export class HttpClientCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private timeoutInMinutes: number;
  private maxSize: number;

  constructor(timeoutInMinutes: number = 5, maxSize: number = 5) {
    this.timeoutInMinutes = timeoutInMinutes;
    this.maxSize = Math.min(maxSize, SIZE_LIMIT);
  }

  get(key: string): Observable<T> | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (this.expired(entry)) {
      this.cache.delete(key);
      this.log(`Evicted expired key: ${key} `);
      return undefined;
    }

    this.log(`Retrieved from cache: ${key}`);
    return entry.observable$;
  }

  set(key: string, obs$: Observable<T>) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.log(`Evicted oldest key: ${oldestKey} (maxSize: ${this.maxSize})`);
      }
    }

    this.cache.set(key, { observable$: obs$, timestamp: Date.now() });
    this.log(`Added to cache: ${key}\r\nCurrent size: ${this.cache.size} items(s).`);
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  existsInCache(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.expired(entry)) {
      this.cache.delete(key);
      this.log(`Evicted expired key: ${key} `);
      return false;
    }

    return true;
  }

  clear() {
    this.cache.clear();
    this.log('Cache cleared.');
  }

  cleanup() {
    const now = Date.now();
    let evictedCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.expired(entry)) {
        this.cache.delete(key);
        evictedCount++;
      }
    }
    if (evictedCount > 0) {
      this.log(`Periodic cleanup evicted ${evictedCount} expired keys`);
    }
  }

  private expired(entry: CacheEntry<T>) {
    const ageInMs = Date.now() - entry.timestamp;
    return ageInMs > 1000 * 60 * this.timeoutInMinutes;
  }

  private log(message: string) {
    if (isDevMode()) {
      console.log(`** http-client-cache\r\n${message}`);
    }
  }
}
