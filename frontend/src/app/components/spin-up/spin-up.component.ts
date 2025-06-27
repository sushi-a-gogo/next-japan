import { Component, OnInit, signal } from '@angular/core';
import { PageLoadSpinnerComponent } from "@shared/page-load-spinner/page-load-spinner.component";

@Component({
  selector: 'app-spin-up',
  imports: [PageLoadSpinnerComponent],
  templateUrl: './spin-up.component.html',
  styleUrl: './spin-up.component.scss'
})
export class SpinUpComponent implements OnInit {
  visible = signal(false);
  ngOnInit(): void {
    setTimeout(() => {
      this.visible.set(true);
    }, 100);
  }

}
