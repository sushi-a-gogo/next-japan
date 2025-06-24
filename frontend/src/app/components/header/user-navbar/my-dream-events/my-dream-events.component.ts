import { Component, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';
import { ModalComponent } from "@app/shared/modal/modal.component";

@Component({
  selector: 'app-my-dream-events',
  imports: [MatButtonModule, MatRippleModule, ModalComponent],
  templateUrl: './my-dream-events.component.html',
  styleUrl: './my-dream-events.component.scss'
})
export class MyDreamEventsComponent {
  private router = inject(Router);

  close = output<boolean>();
  events = signal<EventData[]>([])

  navigateToDream() {
    this.router.navigate(['./dream']);
  }


  closeDialog() {
    this.close.emit(true);
  }
}
