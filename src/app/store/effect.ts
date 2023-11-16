import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {map, exhaustMap, catchError, tap} from 'rxjs/operators';

import {UploadPhotoService} from "../services/upload-photo.service";
import {
  AUTHENTICATE, authenticated,
  CREATE_ACTION,
  CREATE_PHOTO_ACTION,
  createdPhoto, RECEIVE_ALL_PHOTOS,
  RECEIVE_CHAPTERS,
  receivedChapters, receivedPhotos
} from './action';
import {CreateChapter} from "../models/dto/create-chapter";
import {Store} from "@ngrx/store";
import {Photo} from "../models/photo";
import {AuthorizationService} from "../services/authorization/authorization.service";
import {Chapter} from "../models/chapter";


@Injectable()
export class GalleryEffects {

  createChapter$ = createEffect(() => this.actions$.pipe(
    ofType(CREATE_ACTION),
    tap(x => console.log('TEST__________________________________')),
    exhaustMap((chapter: { payload: CreateChapter }) => this.uploadService.createChapter(chapter)),
    map((chapters: Chapter[]) => receivedChapters({ chapters })),
    catchError(() => EMPTY)
  ));

  createPhoto$ = createEffect(() => this.actions$.pipe(
    ofType(CREATE_PHOTO_ACTION),
    tap(x => console.log('CREATE__________________AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', x)),
    exhaustMap((photo: { payload: Photo }) => {
      return this.uploadService.uploadPhoto(photo);
    }),
    map((photo: any) => createdPhoto({ photo })),
    catchError(() => EMPTY)
  ));

  receiveChapters$ = createEffect(() => this.actions$.pipe(
    ofType(RECEIVE_CHAPTERS),
    exhaustMap((chapters) => {

      return this.uploadService.getChapters()
    }),
    map((chapters: Chapter[]) => receivedChapters({ chapters }))
  ));

  getAllPhotos$ = createEffect(() => this.actions$.pipe(
    ofType(RECEIVE_ALL_PHOTOS),
    exhaustMap((chapter: { chapter: string }) => this.uploadService.getAllPhotos(chapter.chapter)),
    tap((c) => console.log('__PHOTOS___111____', c)),
    map((photos) => receivedPhotos({ photos }))
  ))

  authenticate$ = createEffect(() => this.actions$.pipe(
    ofType(AUTHENTICATE),
    exhaustMap((creds: { credentials: { email: string; password: string; }}) =>
      this.authorizationService
        .authenticate({ email: creds.credentials.email, password: creds.credentials.password })),
    tap((c) => console.log('___CREDS______', c)),
    map((token: string) => authenticated({ token }))
  ))

  constructor(
    private actions$: Actions,
    private uploadService: UploadPhotoService,
    private authorizationService: AuthorizationService,
    private store: Store<any>
  ) {
  }
}
