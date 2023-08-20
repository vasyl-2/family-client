import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from './material/material.module';
import { CreatePhotoComponent } from './components/create-photo/create-photo.component';
import { IsLoggedInDirective } from './directives/is-logged-in.directive';

const components = [
  CreatePhotoComponent
];

const directives = [
  IsLoggedInDirective
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
