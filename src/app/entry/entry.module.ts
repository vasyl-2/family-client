import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { EntryComponent } from './components/entry/entry.component';
import { EntryRoutingModule } from "./entry-routing.module";
import { UsersComponent } from './components/users/users.component';
import { SharedModule } from "../shared/shared.module";
import { RolesComponent } from './components/roles/roles.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { SelectRoleComponent } from './components/select-role/select-role.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { RoleEditComponent } from './components/role-edit/role-edit.component';
import { PermissionEditComponent } from './components/permission-edit/permission-edit.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { CreatePermissonComponent } from './components/create-permisson/create-permisson.component';

const components = [
  EntryComponent,
  UsersComponent,
  RolesComponent,
  UserEditComponent,
  CreateUserComponent,
  SelectRoleComponent,
  PermissionsComponent
];
const directives = []
;
@NgModule({
  declarations: [
    ...components,
    RoleEditComponent,
    PermissionEditComponent,
    CreateRoleComponent,
    CreatePermissonComponent,
    // ...directives
  ],
  imports: [
    CommonModule,
    EntryRoutingModule,
    SharedModule
  ],
  exports: [
    ...components
  ]
})
export class EntryModule { }
