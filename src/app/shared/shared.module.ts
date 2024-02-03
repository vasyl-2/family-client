import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from './material/material.module';
import { CreatePhotoComponent } from './components/create-photo/create-photo.component';
import { IsLoggedInDirective } from './directives/is-logged-in.directive';
import { CreateChapterComponent } from './components/create-chapter/create-chapter.component';
import { TreeChaptersComponent } from './components/tree-chapters/tree-chapters.component';
import { HighlightDirective } from './directives/highlight.directive';
import { ChapterListComponent } from './components/chapter-list/chapter-list.component';
import { PhotosListComponent } from './components/photos-list/photos-list.component';
import { PhotoComponent } from './components/photo/photo.component';
import { EditDescriptionComponent } from './components/edit-description/edit-description.component';
import { CreateVideoComponent } from './components/create-video/create-video.component';
import { SetHeightDirective } from './directives/set-height.directive';
import { EnlargeDirective } from './directives/enlarge/enlarge.directive';

const components = [
  CreatePhotoComponent,
  ChapterListComponent,
  CreateChapterComponent,
  TreeChaptersComponent,
  PhotosListComponent,
  PhotoComponent,
  EditDescriptionComponent,
  CreateVideoComponent
];

const directives = [
  IsLoggedInDirective,
  HighlightDirective,
  SetHeightDirective,
  EnlargeDirective
]
@NgModule({
  declarations: [
    ...components, ...directives
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ...components
  ]
})
export class SharedModule { }
