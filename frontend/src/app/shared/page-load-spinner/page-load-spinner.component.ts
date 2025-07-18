import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinHostComponent } from "./spin-host/spin-host.component";

@Component({
  selector: 'app-page-load-spinner',
  imports: [MatProgressSpinnerModule, SpinHostComponent],
  templateUrl: './page-load-spinner.component.html',
  styleUrl: './page-load-spinner.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('125ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
  host: { '[@fadeIn]': '' }
})
export class PageLoadSpinnerComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  spinUp = signal(false);
  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.spinUp.set(true);
      }, 2500);
    }
  }
}

