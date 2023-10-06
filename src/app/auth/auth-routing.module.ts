import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "../core/login/login.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { LogoutComponent } from "../core/logout/logout.component";

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
