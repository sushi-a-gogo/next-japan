import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: 'app-about',
  imports: [MatButtonModule, MatRippleModule, ModalComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  close = output<boolean>();

}
