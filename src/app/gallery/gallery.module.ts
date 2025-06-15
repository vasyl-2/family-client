import { NgModule } from '@angular/core';

import { GalleryRoutingModule } from './gallery-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [GalleryRoutingModule, SharedModule],
})
export class GalleryModule {}
