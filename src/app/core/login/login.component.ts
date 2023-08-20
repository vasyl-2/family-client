import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

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
}
