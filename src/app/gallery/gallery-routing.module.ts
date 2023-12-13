import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GalleryComponent } from "./gallery/gallery.component";
import { PhotosListComponent } from "../shared/components/photos-list/photos-list.component";

const routes: Routes = [
  {
    path: '', component: GalleryComponent
  },
  {
    path: ':chapter',
    component: PhotosListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
