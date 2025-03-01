import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import { Role } from '../../../models/role';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoleComponent } from '../create-role/create-role.component';
import { RoleEditComponent } from '../role-edit/role-edit.component';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RolesComponent {
  @Input() roles!: Role[] | null | undefined;
  constructor(private dialog: MatDialog) {}
  @Output() newRole = new EventEmitter<Role>();
  @Output() updatedRole = new EventEmitter<Role>();

  addRole(): void {
    const dialogRef = this.dialog.open(CreateRoleComponent, {});

    dialogRef.afterClosed().subscribe((role: Role) => {
      if (!role) {
        return;
      }

      console.log('NEW_ROLE_TO__ADD+!!!!', role);

      this.newRole.emit(role);
    });
  }

  editRole(role: string | undefined): void {
    if (!role) {
      return;
    }

    const dialogRef = this.dialog.open(RoleEditComponent, {});
  }
}
