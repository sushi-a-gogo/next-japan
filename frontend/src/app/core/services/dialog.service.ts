import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export interface DialogConfig<T> {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'dynamic';
  showBackdrop?: boolean;
  data?: T;
  component: any;  // Type<any> or better with generics if you want
}

export interface DialogRef<T> {
  close: (result?: T) => void;
  afterClosed: Observable<T | undefined>;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRequest$ = new BehaviorSubject<DialogConfig<any> | null>(null);
  private closeSubject$ = new BehaviorSubject<any>(null);

  open<T>(config: DialogConfig<T>): DialogRef<T> {
    this.dialogRequest$.next(config);

    const afterClosed = this.closeSubject$.pipe(
      filter(result => result !== null),
      take(1)
    );

    return {
      close: (result?: T) => {
        this.closeDialog(result);
      },
      afterClosed
    };
  }

  closeDialog<T>(result?: T) {
    this.closeSubject$.next(result);
    this.dialogRequest$.next(null);
    this.closeSubject$.next(null); // reset for next open
  }

  get request$() {
    return this.dialogRequest$.asObservable();
  }
}
