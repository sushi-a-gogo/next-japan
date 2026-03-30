import { Component, input, output } from '@angular/core';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'button[nextButton], a[nextButton]',
  standalone: true,
  imports: [MatRippleModule, MatTooltipModule],
  template: `<ng-content />`,
  hostDirectives: [
    MatRipple,
    {
      directive: MatTooltip,
      inputs: ['matTooltip: tooltip'] // Maps 'tooltip' input to matTooltip
    }],
  host: {
    'matRipple': '',
    'class': 'app-button',
    '[attr.data-variant]': 'variant()', // This "links" the TS to the CSS
  },
  styleUrls: ['./next-button.component.scss']
})
export class NextButtonComponent {
  // Only keep what is truly "custom" or extra functionality
  tooltip = input<string>();

  // Custom "Touch Awareness" logic stays here if native (click) isn't enough
  touchAware = input<boolean>();
  buttonClick = output<MouseEvent | TouchEvent>();
  variant = input<'priority'>();

  handleTouchEnd($event: TouchEvent) {
    if (this.touchAware()) {
      this.buttonClick.emit($event);
    }
  }
}
