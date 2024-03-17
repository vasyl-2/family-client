import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {map, exhaustMap, catchError, tap} from 'rxjs/operators';
import {Store} from "@ngrx/store";

import {
  AUTHENTICATE, authenticated,
  CREATE_ACTION,
  CREATE_PHOTO_ACTION, CREATE_VIDEO_ACTION,
  createdPhoto, createdVideo, EDIT_PHOTO_ACTION, editedPhoto, RECEIVE_ALL_PHOTOS, RECEIVE_ALL_VIDEOS,
  RECEIVE_CHAPTERS,
  receivedChapters, receivedPhotos, receivedVideos
} from './action';

import {CreateChapter} from "../models/dto/create-chapter";
import {Photo} from "../models/photo";
import {Chapter} from "../models/chapter";
import {Video} from "../models/video";

import {AuthorizationService} from "../services/authorization/authorization.service";
import {UploadPhotoService} from "../services/upload-photo.service";

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
    tap(x => console.log('CREATE__________________PHOTO', x)),
    exhaustMap((photo: { payload: Photo }) => {
      return this.uploadService.uploadPhoto(photo);
    }),
    map((photo: any) => createdPhoto({ photo })),
    catchError(() => EMPTY)
  ));

  updatePhoto$ = createEffect(() => this.actions$.pipe(
    ofType(EDIT_PHOTO_ACTION),
    tap(x => console.log('UPDATE_________________PHOTO', x)),
    exhaustMap((photo: { photo: Partial<Photo> }) => {
      return this.uploadService.updatePhoto(photo.photo);
    }),
    tap((p) => console.log('EDITED___PHOTO_________', p)),
    map((photo: any) => editedPhoto({ photo })),
    catchError(() => EMPTY)
  ));

  createVideo$ = createEffect(() => this.actions$.pipe(
    ofType(CREATE_VIDEO_ACTION),
    tap((video) => console.log('CREATE__________________VIDEO', video)),
    exhaustMap((video: { payload: Video }) => {
      return this.uploadService.uploadVideo(video);
    }),
    map((video: any) => createdVideo({ video })), // TODO change from any!!!
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
    tap((c: Photo[]) => console.log('__PHOTOS___111____', c)),
    map((photos) => receivedPhotos({ photos }))
  ));

  getAllVideos$ = createEffect(() => this.actions$.pipe(
    ofType(RECEIVE_ALL_VIDEOS),
    exhaustMap((chapter: { chapter: string }) => this.uploadService.getAllVideos(chapter.chapter)),
    tap((c: Video[]) => console.log('__VIDEOS___111____', c)),
    map((videos) => receivedVideos({ videos }))
  ));


  authenticate$ = createEffect(() => this.actions$.pipe(
    ofType(AUTHENTICATE),
    exhaustMap((creds: { credentials: { email: string; password: string; }}) =>
      this.authorizationService
        .authenticate({ email: creds.credentials.email, password: creds.credentials.password })),
    tap((c) => console.log('___CREDS______', c)),
    map((token: string) => authenticated({ token }))
  ));

  constructor(
    private actions$: Actions,
    private uploadService: UploadPhotoService,
    private authorizationService: AuthorizationService,
    private store: Store<any>
  ) {
  }
}
