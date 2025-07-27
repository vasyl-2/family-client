import { NgModule } from '@angular/core';
import { HeaderTopComponent } from './header-top/header-top.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [HeaderTopComponent, LoginComponent, LogoutComponent],
  imports: [SharedModule, RouterModule, NgxPermissionsModule.forChild(), TranslateModule],
  exports: [HeaderTopComponent],
})
export class CoreModule {}
