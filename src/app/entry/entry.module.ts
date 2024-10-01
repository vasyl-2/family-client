import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { EntryComponent } from './components/entry/entry.component';
import { EntryRoutingModule } from "./entry-routing.module";
import { UsersComponent } from './components/users/users.component';
import { SharedModule } from "../shared/shared.module";
import { RolesComponent } from './components/roles/roles.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

const components = [
  EntryComponent,
  UsersComponent,
  RolesComponent,
  UserEditComponent,
  CreateUserComponent
]
@NgModule({
  declarations: [
    ...components,
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
