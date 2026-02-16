import { Component, input } from '@angular/core';
import { EventCoordinator } from '@app/features/events/models/event-coordinator.model';
import { AvatarComponent } from "@app/features/user/ui/avatar/avatar.component";

@Component({
  selector: 'app-event-coordinators',
  imports: [AvatarComponent],
  templateUrl: './event-coordinators.component.html',
  styleUrl: './event-coordinators.component.scss'
})
export class EventCoordinatorsComponent {
  eventCoordinators = input<EventCoordinator[]>([]);
}
