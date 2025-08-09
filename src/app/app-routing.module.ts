import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartComponent } from './componenta/start/start.component';
import { RbacIsReadyGuard } from './shared/guards/rbac-is-ready.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    canActivate: [RbacIsReadyGuard],
    component: StartComponent,
  },
  {
    path: 'entry',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['create_user', 'edit_user'],
      },
    },
    loadChildren: () =>
      import('./entry/entry.module').then((m) => m.EntryModule),
  },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./gallery/gallery.module').then((m) => m.GalleryModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
