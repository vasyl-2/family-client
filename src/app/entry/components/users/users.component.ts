import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

import {User} from "../../../models/user";
import {UserEditComponent} from "../user-edit/user-edit.component";
import {CreateUserComponent} from "../create-user/create-user.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {

  @Input() users!: User[] | null;
  @Output() user = new EventEmitter<User>();
  @Output() newUser = new EventEmitter<User>();

  constructor(
    private dialog: MatDialog,
  ) {
  }

  editUser(id: string | undefined): void {

    if (!id) {
      return;
    }
    if (!this.users) {
      return;
    }
    const user = this.users.find((user: User) => user._id === id);

    if (!user) {
      return;
    }

    const dialogRef = this.dialog.open(UserEditComponent, {
      data: user
    })

    dialogRef.afterClosed().subscribe((u: User) => {
      console.log('USED EDITED____', u);
      if (u.name !== user.name || u.role !== user.role) {
        let userChanges: User = {} as User;
        if (u.name !== user.name) {
          userChanges.name = u.name;
        }
        if (u.role !== user.role) {
          userChanges.role = u.role;
        }

        this.user.emit(userChanges);
      }
    })
  }

  addUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {

    });

    dialogRef.afterClosed().subscribe((u: User) => {
      if (!u) {
        return;
      }

      this.newUser.emit(u);

    })
  }
}
