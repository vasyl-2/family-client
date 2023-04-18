import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {EntryComponent} from "./components/entry/entry.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listphotos',
    pathMatch: 'full'
  },
  {
    path: 'listphotos',
    component: EntryComponent,
    data: { animation: 'heroes' }
  }
]
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
