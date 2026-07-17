import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { EventCoordinator } from '@app/features/events/models/event-coordinator.model';
import { AvatarComponent } from "@app/features/user/ui/avatar/avatar.component";

@Component({
  selector: 'app-event-coordinators',
  imports: [AvatarComponent],
  templateUrl: './event-coordinators.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './event-coordinators.component.scss'
})
export class EventCoordinatorsComponent {
  eventCoordinators = input<EventCoordinator[]>([]);
}
