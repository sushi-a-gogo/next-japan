import { animate, state, style, transition, trigger } from "@angular/animations";

const fadeIn = trigger('fadeIn', [
  state('void', style({
    opacity: 0,
  })),
  state('in', style({
    opacity: 1,
  })),
  transition('void => in', [
    animate('400ms ease-out')
  ])
]);

export default fadeIn;
