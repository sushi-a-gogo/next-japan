import { animate, state, style, transition, trigger } from "@angular/animations";

const blur = trigger('blur', [
  state('void', style({
    opacity: 0.25,
    filter: 'blur(5px)'
  })),
  state('in', style({
    opacity: 1,
    filter: 'blur(0)'
  })),
  transition('void => in', [
    animate('600ms ease-out')
  ])
]);

export default blur;
