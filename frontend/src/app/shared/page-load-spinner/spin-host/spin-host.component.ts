import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-spin-host',
  imports: [MatProgressSpinnerModule],
  templateUrl: './spin-host.component.html',
  styleUrl: './spin-host.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
  host: { '[@fadeIn]': '' }
})
export class SpinHostComponent implements OnInit {
  delay = input<number>(1000);
  showSpinner = signal(false);

  ngOnInit() {
    setTimeout(() => {
      this.showSpinner.set(true);
    }, this.delay());
  }
}
