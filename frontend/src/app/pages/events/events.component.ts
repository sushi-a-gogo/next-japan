import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "@app/components/layout/layout.component";

@Component({
  selector: 'app-events',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EventsComponent {

}
