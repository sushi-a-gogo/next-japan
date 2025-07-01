import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-event',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {

}
