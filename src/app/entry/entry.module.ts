import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { EntryComponent } from './components/entry/entry.component';
import {EntryRoutingModule} from "./entry-routing.module";

@NgModule({
  declarations: [
    EntryComponent,
  ],
  imports: [
    CommonModule,
    EntryRoutingModule
  ],
  exports: [
    EntryComponent
  ]
})
export class EntryModule { }
