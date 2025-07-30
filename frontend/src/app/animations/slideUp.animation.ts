import { animate, state, style, transition, trigger } from "@angular/animations";

const slideUp = trigger('slideUp', [
  state('void', style({
    transform: 'translateY(40px)'
  })),
  state('in', style({
    transform: 'translateY(0px)'
  })),
  transition('void => in', [
    animate('600ms ease-out')
  ])
]);

export default slideUp;
