import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  private readonly hideSubject = new BehaviorSubject(true);
  hide$ = this.hideSubject.asObservable();

  constructor(private fB: FormBuilder) {
  }

  get nameControl(): FormControl {
    return this.loginForm.get('name') as FormControl;
  }

  get pswdControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fB.group({
      name: this.fB.control('', [Validators.required]),
      password: this.fB.control('', [Validators.required]),
    })
  }

  changeHide(): void {
    this.hideSubject.next(!this.hideSubject.value);
  }
}
