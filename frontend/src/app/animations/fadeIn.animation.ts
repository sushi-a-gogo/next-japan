import { animate, state, style, transition, trigger } from "@angular/animations";

const fadeIn = trigger('fadeIn', [
  state('void', style({
    opacity: 0,
  })),
  state('in', style({
    opacity: 1,
  })),
  transition('void => in', [
    animate('600ms ease-out')
  ])
]);

export default fadeIn;
