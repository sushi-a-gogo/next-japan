import { Component, HostListener, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dotted-bg',
  templateUrl: './dotted-bg.svg',
  styleUrls: [],
})
export class DottedBgComponent implements OnInit {
  fill = input<string>('#00aeef');
  viewBox?: string;
  rectWidth = 0;
  rectHeight = 0;

  private svgWidth = 1200;

  constructor() { }

  ngOnInit(): void {
    this.resize();
  }

  get fillColor() {
    return `stop-color:${this.fill()}`;
  }

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  private resize() {
    this.rectWidth = Math.min(this.svgWidth, window.innerWidth);
    this.rectHeight = window.innerHeight;
    this.viewBox = `0 0 ${this.rectWidth} ${this.rectHeight}`;
  }
}
