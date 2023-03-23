import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "./material/material.module";
import { CreatePhotoComponent } from './components/create-photo/create-photo.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const components = [
  CreatePhotoComponent
]
@NgModule({
  declarations: [
    ...components
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
