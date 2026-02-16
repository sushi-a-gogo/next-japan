import { Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-anchor',
  imports: [RouterLink, MatRippleModule, MatTooltipModule],
  templateUrl: './anchor.component.html',
  styleUrl: './anchor.component.scss'
})
export class AnchorComponent {
  cssClass = input<string>();
  rippleEnabled = input<boolean>(true);
  label = input<string>();
  tooltip = input<string>();
  link = input.required<string>();
  queryParams = input<any>();
}
