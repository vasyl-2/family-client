import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from './material/material.module';
import { CreatePhotoComponent } from './components/create-photo/create-photo.component';
import { IsLoggedInDirective } from './directives/is-logged-in.directive';
import { CreateChapterComponent } from './components/create-chapter/create-chapter.component';
import { TreeChaptersComponent } from './components/tree-chapters/tree-chapters.component';
import { HighlightDirective } from './directives/highlight.directive';

const components = [
  CreatePhotoComponent
];

const directives = [
  IsLoggedInDirective
]
@NgModule({
  declarations: [
    ...components, ...directives, CreateChapterComponent, TreeChaptersComponent, HighlightDirective
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
