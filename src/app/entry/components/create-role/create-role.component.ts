import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import { GalleryState } from '../../../store/reducer';
import { Observable } from 'rxjs';
import { Permission } from '../../../models/permission';
import { permissionsSelector } from '../../../store/selectors';
import { rolesValidator } from '../../validators/roles-validator';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CreateRoleComponent implements OnInit {
  role!: FormGroup;
  permissions$!: Observable<Permission[] | undefined>;

  constructor(
    private fB: FormBuilder,
    public dialogRef: MatDialogRef<CreateRoleComponent>,
    private store: Store<GalleryState>,
  ) {}

  get roleControl(): FormControl {
    return this.role.get('permissions') as FormControl;
  }

  get nameControl(): FormControl {
    return this.role.get('name') as FormControl;
  }

  get displayNameControl(): FormControl {
    return this.role.get('displayName') as FormControl;
  }

  ngOnInit(): void {
    this.permissions$ = this.store.pipe(select(permissionsSelector));

    this.initForm();
  }

  close(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.role = this.fB.group({
      name: this.fB.control('', [Validators.required]),
      displayName: this.fB.control('', [Validators.required]),
      permissions: this.fB.control('', [rolesValidator()]),
    });
  }
}
