import { Component } from '@angular/core';
import { EventBannerComponent } from "./event-banner/event-banner.component";

@Component({
  selector: 'app-event-header',
  imports: [EventBannerComponent],
  templateUrl: './event-header.component.html',
  styleUrl: './event-header.component.scss'
})
export class EventHeaderComponent {
}
