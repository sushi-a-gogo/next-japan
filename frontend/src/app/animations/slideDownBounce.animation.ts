import { animate, keyframes, state, style, transition, trigger } from "@angular/animations";

const slideDownBounce = trigger('slideDownBounce', [
  state('void', style({
    transform: 'translateY(-40px)',
    opacity: 0
  })),
  state('in', style({
    transform: 'translateY(0)',
    opacity: 1
  })),
  transition('void => in', [
    animate('600ms ease-out', keyframes([
      style({ transform: 'translateY(-40px)', opacity: 0, offset: 0 }),
      style({ transform: 'translateY(5px)', opacity: 1, offset: 0.8 }), // Overshoot
      style({ transform: 'translateY(-2px)', offset: 0.9 }), // Bounce back
      style({ transform: 'translateY(0)', offset: 1 }) // Settle
    ]))
  ])
]);

export default slideDownBounce;
