import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import {
  getUsers,
  createUser,
  editUser,
  getRoles,
  getPermissions,
  createRole,
  editRole,
} from '../../../store/action';
import { GalleryState } from '../../../store/reducer';
import {
  permissionsSelector,
  rolesSelector,
  usersSelector,
} from '../../../store/selectors';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';
import { Permission } from '../../../models/permission';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class EntryComponent implements OnInit {
  users$!: Observable<User[] | undefined>;
  roles$!: Observable<Role[] | undefined>;
  permissions$!: Observable<Permission[] | undefined>;

  constructor(private store: Store<GalleryState>) {}

  ngOnInit(): void {
    this.users$ = this.store.pipe(select(usersSelector));
    this.roles$ = this.store.pipe(select(rolesSelector));
    this.permissions$ = this.store.pipe(select(permissionsSelector));

    this.store.dispatch(getUsers());
    this.store.dispatch(getRoles());
    this.store.dispatch(getPermissions());
  }

  onUpdate(user: User): void {
    console.log('UPDATED___USER____', user);
    this.store.dispatch(editUser({ user }));
  }

  createUser(user: User): void {
    console.log('CREATE___USER____', user);
    this.store.dispatch(createUser({ user }));
  }

  createRole(role: Role): void {
    console.log('CREATE___ROLE____', role);
    this.store.dispatch(createRole({ role }));
  }

  onUpdateRole(role: Role): void {
    console.log('UPDATED___ROLE____', role);
    this.store.dispatch(editRole({ role }));
  }
}
