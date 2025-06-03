import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss'
})
export class AppLogoComponent {
  size = input<number>(48);
  imageOnly = input<boolean>(false);
  style = computed(() => ({ width: `${this.size()}px`, height: `${this.size}px` }));

}
