import { Component, input, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-page-load-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './page-load-spinner.component.html',
  styleUrl: './page-load-spinner.component.scss'
})
export class PageLoadSpinnerComponent implements OnInit {
  delay = input<number>(250);
  showSpinner = signal(false);

  ngOnInit() {
    setTimeout(() => {
      this.showSpinner.set(true);
    }, this.delay());
  }
}

