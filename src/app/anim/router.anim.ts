import { trigger, state, transition, style, animate, keyframes } from '@angular/animations';

export const slideToRight = trigger('routeAnim', [
  state('void', style({position: 'fixed', width: '100%', height: '80%'})),
  state('*', style({position: 'fixed', width: '100%', height: '80%'})),
  transition('void => *', [
    style({transform: 'translateX(-100px)'}),
    animate('0.5s ease-in-out', style({transform: 'translateX(0)'}))
  ]),
  transition('* => void', [
    style({transform: 'translateX(0)'}),
    animate('0.5s ease-in-out', style({transform: 'translateX(100px)'}))
  ]),
]);
