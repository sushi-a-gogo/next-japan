import { Component, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-page-load-spinner',
  imports: [NgxSpinnerComponent],
  templateUrl: './page-load-spinner.component.html',
  styleUrl: './page-load-spinner.component.scss',
  host: {
    '[class.removed]': 'remove()'
  }
})
export class PageLoadSpinnerComponent implements OnInit, OnChanges {
  delay = input<number>(250);
  remove = input<boolean>(false);
  removed = signal(false);
  private spinner = inject(NgxSpinnerService);

  ngOnInit() {
    this.spinner.hide();
    setTimeout(() => {
      if (!this.removed()) {
        this.spinner.show();
      }
    }, this.delay());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['remove']) {
      this.removed.set(changes['remove']?.currentValue || false);
    }
  }
}
