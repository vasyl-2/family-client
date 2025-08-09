import {importProvidersFrom, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer,
} from '@ngrx/router-store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS, HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { StartComponent } from './componenta/start/start.component';

import { actionReducers } from './store/reducer';
import { DIALOG_CONFIG } from './data/dialog-config';
import { GalleryEffects } from './store/effect';
import { InterceptorService } from './services/authorization/interceptor.service';
import { RouterCustomSerializer } from './services/router-custom-serializer';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatNativeDateModule } from '@angular/material/core';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, '/assets/i18n/', '.json');


@NgModule({
  declarations: [AppComponent, StartComponent],
  bootstrap: [AppComponent],
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
    CommonModule,
    NgxPermissionsModule.forRoot(),
    MatNativeDateModule,
    TranslateModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: DIALOG_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: RouterStateSerializer, useClass: RouterCustomSerializer },
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })])
  ],
})
export class AppModule {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['de', 'en', 'uk', 'es']);
    this.translate.setDefaultLang('uk');
  }
}
