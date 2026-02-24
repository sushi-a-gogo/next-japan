import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface DialogConfig<TData> {
  data?: TData;
  component: any;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  showBackdrop?: boolean;
}

export interface DialogRef<TData> {
  close: (result?: TData) => void;
  afterClosed: Observable<TData | undefined>;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private activeClose$?: Subject<any>;
  private dialogRequest = signal<DialogConfig<any> | null>(null);
  request = this.dialogRequest.asReadonly();

  open<TData>(config: DialogConfig<TData>): DialogRef<TData> {
    if (this.activeClose$) {
      this.closeDialog();
    }
    const close$ = new Subject<TData | undefined>();
    this.activeClose$ = close$;

    const normalized: DialogConfig<TData> = {
      size: 'sm',
      showBackdrop: true,
      ...config
    };
    this.dialogRequest.set(normalized);

    return {
      close: (result?: TData) => this.closeDialog(result),
      afterClosed: close$.asObservable()
    };
  }

  closeDialog<T>(result?: T) {
    this.activeClose$?.next(result);
    this.activeClose$?.complete();
    this.activeClose$ = undefined;

    this.dialogRequest.set(null);
  }
}
