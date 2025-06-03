import { Component, output } from '@angular/core';

@Component({
  selector: 'app-event-navbar',
  imports: [],
  templateUrl: './event-navbar.component.html',
  styleUrl: './event-navbar.component.scss'
})
export class EventNavbarComponent {
  setFocus = output<string>();

  setFocusToDescription($event: any) {
    $event.preventDefault();
    this.setFocus.emit('description');
  }

  setFocusToLocations($event: any) {
    $event.preventDefault();
    this.setFocus.emit('locations');
  }

  setFocusToCoordinators($event: any) {
    $event.preventDefault();
    this.setFocus.emit('coordinators');
  }

  setFocusToCalendar($event: any) {
    $event.preventDefault();
    this.setFocus.emit('calendar');
  }

}
