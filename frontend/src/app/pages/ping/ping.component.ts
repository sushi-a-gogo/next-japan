import { Component } from '@angular/core';

@Component({
  selector: 'app-ping',
  imports: [],
  template: `{{ '{' }} "status":"ok", "timestamp":"{{ timestamp }}" {{''}}`,
})
export class PingComponent {
  timestamp = new Date().toISOString();
}
