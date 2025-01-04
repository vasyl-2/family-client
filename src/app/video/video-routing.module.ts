import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VideoComponent } from './video-component/video.component';
import { VideoListComponent } from '../shared/components/video-list/video-list.component';

const routes: Routes = [
  {
    path: '',
    component: VideoComponent,
  },
  {
    path: ':chapter',
    component: VideoListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
