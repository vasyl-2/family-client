import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Role } from '../../../models/role';
import { GalleryState } from '../../../store/reducer';
import { rolesSelector } from '../../../store/selectors';
import { rolesValidator } from '../../validators/roles-validator';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent implements OnInit {
  user!: FormGroup;
  roles$!: Observable<Role[] | undefined>;

  constructor(
    private fB: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private store: Store<GalleryState>,
  ) {}

  get roleControl(): FormControl {
    return this.user.get('role') as FormControl;
  }

  get emailControl(): FormControl {
    return this.user.get('email') as FormControl;
  }

  ngOnInit(): void {
    this.roles$ = this.store.pipe(select(rolesSelector));
    this.initForm();

    this.roles$.subscribe((r) => console.log('ROLES_____', r));
  }

  close(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.user = this.fB.group({
      email: this.fB.control('', [Validators.required]),
      role: this.fB.control('', [rolesValidator()]),
    });
  }
}
