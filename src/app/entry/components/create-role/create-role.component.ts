import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";

import {GalleryState} from "../../../store/reducer";

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoleComponent implements OnInit {

  role!: FormGroup;

  constructor(
    private fB: FormBuilder,
    public dialogRef: MatDialogRef<CreateRoleComponent>,
    private store: Store<GalleryState>
  ) {
  }

  ngOnInit(): void {

  }

  close(): void {
    this.dialogRef.close();
  } private initForm(): void {
    this.role = this.fB.group({
      name: '',
      permissions: []
    })
  }

}
