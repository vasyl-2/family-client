import { NgModule } from '@angular/core';
import { HeaderTopComponent } from './header-top/header-top.component';
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    HeaderTopComponent,
    LoginComponent,
    LogoutComponent,
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    HeaderTopComponent
  ]
})
export class CoreModule { }
