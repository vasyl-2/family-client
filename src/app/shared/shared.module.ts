import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';

import { IsLoggedInDirective } from './directives/is-logged-in.directive';
import { SetHeightDirective } from './directives/set-height.directive';
import { EnlargeDirective } from './directives/enlarge/enlarge.directive';
import { HighlightDirective } from './directives/highlight.directive';

import { CreatePhotoComponent } from './components/create-photo/create-photo.component';
import { CreateChapterComponent } from './components/create-chapter/create-chapter.component';
import { TreeChaptersComponent } from './components/tree-chapters/tree-chapters.component';
import { ChapterListComponent } from './components/chapter-list/chapter-list.component';
import { PhotosListComponent } from './components/photos-list/photos-list.component';
import { PhotoComponent } from './components/photo/photo.component';
import { EditDescriptionComponent } from './components/edit-description/edit-description.component';
import { CreateVideoComponent } from './components/create-video/create-video.component';
import { FullSizePhotoComponent } from './components/full-size-photo/full-size-photo.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { VideoElementComponent } from './components/video-element/video-element.component';
import { SearchComponent } from './components/search/search.component';
import { RangeSizeComponent } from './components/range-size/range-size.component';
import { EditChapterComponent } from './components/edit-chapter/edit-chapter.component';
import { EditChaptersComponent } from './components/edit-chapters/edit-chapters.component';
import { VideoComponent } from './components/video/video.component';
import { AddClassDirective } from './directives/add-class.directive';
import {ViewSettingsComponent} from "./components/view-settings/view-settings.component";
import {TranslateModule} from "@ngx-translate/core";

const components = [
  CreatePhotoComponent,
  ChapterListComponent,
  CreateChapterComponent,
  TreeChaptersComponent,
  PhotosListComponent,
  PhotoComponent,
  VideoComponent,
  EditDescriptionComponent,
  CreateVideoComponent,
  FullSizePhotoComponent,
  VideoListComponent,
  VideoElementComponent,
  SearchComponent,
  RangeSizeComponent,
  EditChapterComponent,
  EditChaptersComponent,
  ViewSettingsComponent
];

const directives = [
  IsLoggedInDirective,
  HighlightDirective,
  SetHeightDirective,
  EnlargeDirective,
  AddClassDirective,
];
@NgModule({
  declarations: [...components, ...directives],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ...components,
    ...directives,
  ],
})
export class SharedModule {}
