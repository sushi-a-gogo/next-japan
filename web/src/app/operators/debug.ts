import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxJsLoggingLevel = RxJsLoggingLevel.DEBUG;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxJsLoggingLevel = level;
}

export const debug = (level: number, message: string) => (source: Observable<any>) =>
  source.pipe(
    tap((val) => {
      if (level >= rxJsLoggingLevel && isDevMode()) {
        console.log(message + ': ', val);
      }
    })
  );
