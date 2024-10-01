import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

import {User} from "../../../models/user";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {

  user!: FormGroup;

  get roleControl(): FormControl {
    return this.user.get('role') as FormControl;
  };

  get emailControl(): FormControl {
    return this.user.get('email') as FormControl;
  };

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fB: FormBuilder
  ) {
  }

  ngOnInit() {
    this.setUserForm();

    if(!!this.data) {
      if (this.data.email) {
        this.emailControl.setValue(this.data.email);
      }
      if (this.data.role) {
        this.roleControl.setValue(this.data.role);
      }
    }

    this.subscribeToNameChange();
    this.subscribeToRoleChange();
  }

  close(): void {
    this.dialogRef.close();
  }

  private subscribeToNameChange(): void {
    this.emailControl.valueChanges.subscribe((name: string) => {
      this.data.name = name;
    })
  }

  private subscribeToRoleChange(): void {
    this.roleControl.valueChanges.subscribe((role: string) => {
      this.data.role = role;
    })
  }

  private setUserForm(): void {
    this.user = this.fB.group({
      email: '',
      role: '',
    })
  }
}
