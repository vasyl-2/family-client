import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Role} from "../../../models/role";
import {MatDialog} from "@angular/material/dialog";
import {CreateRoleComponent} from "../create-role/create-role.component";
import {RoleEditComponent} from "../role-edit/role-edit.component";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {

  @Input() roles!: Role[] | null| undefined;
  constructor(
    private dialog: MatDialog,
  ) {
  }

  addRole(): void {
    const dialogRef = this.dialog.open(CreateRoleComponent, {

    })
  }

  editRole(role: string | undefined): void {
    if (!role) {
      return;
    }

    const dialogRef = this.dialog.open(RoleEditComponent, {

    })

  }
}
