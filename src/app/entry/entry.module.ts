import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { EntryComponent } from './components/entry/entry.component';
import {EntryRoutingModule} from "./entry-routing.module";
import { ChapterComponent } from './components/chapter/chapter.component';

@NgModule({
  declarations: [
    EntryComponent,
    ChapterComponent
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
