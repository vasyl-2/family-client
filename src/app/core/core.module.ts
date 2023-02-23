import { NgModule } from '@angular/core';
import { HeaderTopComponent } from './header-top/header-top.component';
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    HeaderTopComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HeaderTopComponent
  ]
})
export class CoreModule { }
