import { Component, input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent implements OnInit {
  delay = input<number>(300);
  showSpinner = false;

  ngOnInit() {
    if (this.delay() > 0) {
      setTimeout(() => {
        this.showSpinner = true;
      }, this.delay());
    } else {
      this.showSpinner = true;
    }
  }

}
