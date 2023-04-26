import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from "@ngrx/store";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { EffectsModule } from "@ngrx/effects";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";
import { StartComponent } from './componenta/start/start.component';

import { mainReducer } from "./store/reducer";
import { DIALOG_CONFIG } from "./data/dialog-config";
import { GalleryEffects } from "./store/effect";


@NgModule({
  declarations: [
    AppComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    SharedModule,
    // ReactiveFormsModule,
    // FormsModule,
    StoreModule.forRoot({ gallery: mainReducer }),
    EffectsModule.forRoot([GalleryEffects]),
    CoreModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: DIALOG_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
