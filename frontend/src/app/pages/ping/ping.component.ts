import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ping',
  imports: [],
  template: `{{ '{' }} "status":"ok", "timestamp":"{{ timestamp }}" {{''}}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PingComponent {
  timestamp = new Date().toISOString();
}
