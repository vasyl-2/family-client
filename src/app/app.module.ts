import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from "@ngrx/store";
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { EffectsModule } from "@ngrx/effects";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { StartComponent } from './componenta/start/start.component';

import {actionReducers, mainReducer} from './store/reducer';
import { DIALOG_CONFIG } from './data/dialog-config';
import { GalleryEffects } from './store/effect';
import { InterceptorService } from './services/authorization/interceptor.service';
import { RouterCustomSerializer } from "./services/router-custom-serializer";
import * as fromRouter from '@ngrx/router-store';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreRouterConnectingModule.forRoot(),
    NoopAnimationsModule,
    SharedModule,
    StoreModule.forRoot(actionReducers),
    // StoreModule.forRoot({
    //   gallery: mainReducer,
    //   router: fromRouter.routerReducer
    // }),
    EffectsModule.forRoot([GalleryEffects]),
    CoreModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: DIALOG_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: RouterStateSerializer, useClass: RouterCustomSerializer },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
