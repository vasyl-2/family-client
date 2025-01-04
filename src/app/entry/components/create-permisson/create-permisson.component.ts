import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { GalleryState } from '../../../store/reducer';
import { Role } from '../../../models/role';
import { Permission } from '../../../models/permission';

@Component({
  selector: 'app-create-permisson',
  templateUrl: './create-permisson.component.html',
  styleUrls: ['./create-permisson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePermissonComponent implements OnInit {
  permission!: FormGroup;
  roles$!: Observable<Permission[] | undefined>;

  constructor(
    private fB: FormBuilder,
    public dialogRef: MatDialogRef<CreatePermissonComponent>,
    private store: Store<GalleryState>,
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.permission = this.fB.group({
      name: '',
      roles: [],
    });
  }
}
