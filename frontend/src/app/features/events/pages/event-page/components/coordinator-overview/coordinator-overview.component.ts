import { Component, computed, inject } from '@angular/core';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { AvatarComponent } from "@app/features/user/ui/avatar/avatar.component";

@Component({
  selector: 'app-coordinator-overview',
  imports: [AvatarComponent],
  templateUrl: './coordinator-overview.component.html',
  styleUrl: './coordinator-overview.component.scss'
})
export class CoordinatorOverviewComponent {
  private eventService = inject(EventService);
  eventCoordinators = computed(() => this.eventService.eventData().event?.eventCoordinators || []);

}
