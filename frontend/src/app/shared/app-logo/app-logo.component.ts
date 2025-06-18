import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [NgOptimizedImage],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss'
})
export class AppLogoComponent {
  size = input<number>(48);
  imageOnly = input<boolean>(true);
  style = computed(() => ({ width: `${this.size()}px`, height: `${this.size}px` }));

}
