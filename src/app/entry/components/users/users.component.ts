import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { User } from '../../../models/user';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { Role } from '../../../models/role';
import { areEqualFlatArrays } from '../../../utils/arrays/are-equal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  @Input() users!: User[] | null | undefined;
  @Input() roles!: Role[] | null | undefined;
  @Output() user = new EventEmitter<User>();
  @Output() newUser = new EventEmitter<User>();

  constructor(private dialog: MatDialog) {}

  editUser(id: string | undefined): void {
    if (!id) {
      return;
    }
    if (!this.users) {
      return;
    }
    const user = this.users.find((user: User) => user._id === id);
    console.log('EXISTING__USER____', user);

    if (!user) {
      return;
    }

    const dialogRef = this.dialog.open(UserEditComponent, {
      data: { ...user },
    });

    dialogRef.afterClosed().subscribe((u: User) => {
      if (u) {
        console.log('U_____________', u);
        const rolesChanged = !areEqualFlatArrays(u.role!, user.role!);
        const nameChanged = u?.email !== user.email;

        if (nameChanged || rolesChanged) {
          let userChanges: User = {} as User;

          if (nameChanged) {
            userChanges.email = u.email;
          }
          if (rolesChanged) {
            userChanges.role = u.role;
          }

          userChanges._id = user._id;
          this.user.emit(userChanges);
        }
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {});

    dialogRef.afterClosed().subscribe((u: User) => {
      if (!u) {
        return;
      }

      console.log('NEW_USER_TO__ADD+!!!!', u);

      this.newUser.emit(u);
    });
  }
}
