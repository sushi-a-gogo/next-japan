import { animate, state, style, transition, trigger } from "@angular/animations";

const blurredSlideUp = trigger('blurredSlideUp', [
  state('void', style({
    opacity: 0,
    filter: 'blur(2px)',
    transform: 'translateY(40px)'
  })),
  state('in', style({
    opacity: 1,
    filter: 'blur(0)',
    transform: 'translateY(0)'
  })),
  transition('void => in', [
    animate('600ms ease-out')
  ])
]);

export default blurredSlideUp;
