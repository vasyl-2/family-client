import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartComponent } from "./componenta/start/start.component";

const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'entry',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule)
  },
  {
    path: 'gallery', loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule)
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
