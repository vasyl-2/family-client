import { Directive } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Directive({
  selector: '[appIsLoggedIn]'
})
export class IsLoggedInDirective {

  constructor() { }

}
