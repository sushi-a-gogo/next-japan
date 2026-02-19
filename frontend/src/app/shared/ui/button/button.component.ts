import { Component, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-button',
  imports: [MatRippleModule, MatTooltipModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  buttonType = input<'button' | 'submit'>('button');
  cssClass = input<string>();
  label = input<string>();
  tooltip = input<string>();
  disabled = input<boolean | 'disabled'>();
  touchAware = input<boolean>();
  buttonClick = output<MouseEvent | TouchEvent>();

  handleClick($event: MouseEvent) {
    this.buttonClick.emit($event);
  }

  handleTouchEnd($event: TouchEvent) {
    if (this.touchAware()) {
      this.buttonClick.emit($event);
    }
  }
}
