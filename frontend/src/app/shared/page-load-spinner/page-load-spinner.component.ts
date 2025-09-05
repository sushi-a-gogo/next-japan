import { Component, HostBinding, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-page-load-spinner',
  imports: [NgxSpinnerComponent],
  templateUrl: './page-load-spinner.component.html',
  styleUrl: './page-load-spinner.component.scss'
})
export class PageLoadSpinnerComponent implements OnInit, OnChanges {
  @HostBinding('class.removed') removed = false;

  delay = input<number>(250);
  remove = input<boolean>(false);
  private spinner = inject(NgxSpinnerService);

  ngOnInit() {
    this.spinner.hide();
    setTimeout(() => {
      this.spinner.show();
    }, this.delay());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['remove']) {
      this.removed = changes['remove']?.currentValue || false;
    }
  }
}
