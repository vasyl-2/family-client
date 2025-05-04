import { Directive } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[appIsLoggedIn]',
  standalone: false,
})
export class IsLoggedInDirective {
  constructor() {}
}
