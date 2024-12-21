import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Permission} from "../../../models/permission";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent {

  @Input() permissions!: Permission[] | null | undefined;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  addPermission(): void {

  }

  editPermission(permission: string | undefined): void {
    if (!permission) {
      return;
    }
  }
}
