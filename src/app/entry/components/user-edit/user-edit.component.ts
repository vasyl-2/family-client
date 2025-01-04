import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { User } from '../../../models/user';
import { select, Store } from '@ngrx/store';
import { GalleryState } from '../../../store/reducer';
import { Observable } from 'rxjs';
import { Role } from '../../../models/role';
import { rolesSelector } from '../../../store/selectors';
import { rolesValidator } from '../../validators/roles-validator';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent implements OnInit {
  user!: FormGroup;
  // mutableData!: User;
  roles$!: Observable<Role[] | undefined>;

  get roleControl(): FormControl {
    return this.user.get('role') as FormControl;
  }

  get emailControl(): FormControl {
    return this.user.get('email') as FormControl;
  }

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fB: FormBuilder,
    private store: Store<GalleryState>,
  ) {}

  ngOnInit() {
    this.setUserForm();

    if (!!this.data) {
      // this.mutableData = { ...this.data };

      if (this.data.email) {
        this.emailControl.setValue(this.data.email);
      }
      if (this.data.role) {
        this.roleControl.setValue(this.data.role);
      }
    }

    this.roles$ = this.store.pipe(select(rolesSelector));

    this.subscribeToNameChange();
    this.subscribeToRoleChange();
  }

  close(): void {
    this.dialogRef.close();
  }

  private subscribeToNameChange(): void {
    this.emailControl.valueChanges.subscribe((name: string) => {
      this.data.name = name;
    });
  }

  private subscribeToRoleChange(): void {
    this.roleControl.valueChanges.subscribe((roles: string[]) => {
      console.log('NEW___ROLES_______________', roles);
      this.data.role = roles;
    });
  }

  private setUserForm(): void {
    this.user = this.fB.group({
      email: this.fB.control('', [Validators.required]),
      role: this.fB.control(this.data?.role || [], [rolesValidator()]),
    });
  }
}
