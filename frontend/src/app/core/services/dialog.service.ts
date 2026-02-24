import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface DialogConfig<TData> {
  data?: TData;
  component: any;
  size?: 'sm' | 'md' | 'lg' | 'dynamic';
  showBackdrop?: boolean;
}

export interface DialogRef<TData> {
  close: (result?: TData) => void;
  afterClosed: Observable<TData | undefined>;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRequest$ = new BehaviorSubject<DialogConfig<any> | null>(null);
  private activeClose$?: Subject<any>;

  open<TData>(config: DialogConfig<TData>): DialogRef<TData> {
    const close$ = new Subject<TData | undefined>();
    this.activeClose$ = close$;

    this.dialogRequest$.next(config);

    return {
      close: (result?: TData) => this.closeDialog(result),
      afterClosed: close$.asObservable()
    };
  }

  closeDialog<T>(result?: T) {
    this.activeClose$?.next(result);
    this.activeClose$?.complete();
    this.activeClose$ = undefined;

    this.dialogRequest$.next(null);
  }

  get request$() {
    return this.dialogRequest$.asObservable();
  }
}
