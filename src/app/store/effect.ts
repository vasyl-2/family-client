import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {EMPTY, Observable, of} from 'rxjs';
import {map, exhaustMap, catchError, tap} from 'rxjs/operators';
import {UploadPhotoService} from "../services/upload-photo.service";
import {
  CREATE_ACTION,
  CREATE_PHOTO_ACTION,
  createdChapter,
  createdPhoto,
  RECEIVE_CHAPTERS,
  receivedChapters
} from "./action";
import {CreateChapter} from "../models/dto/create-chapter";
import {Store} from "@ngrx/store";
import {Photo} from "../models/photo";


@Injectable()
export class GalleryEffects {

  createChapter$ = createEffect(() => this.actions$.pipe(
    ofType(CREATE_ACTION),
    exhaustMap((chapter: CreateChapter) => this.uploadService.createChapter(chapter)),
    map((chapter: any) => createdChapter({ chapter })),
    catchError(() => EMPTY)
  ));

  createPhoto$ = createEffect(() => this.actions$.pipe(
    ofType(CREATE_PHOTO_ACTION),
    exhaustMap((photo: { payload: Photo }) => {
      console.log('PHOTO__EFFECT____________', photo);
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
    tap((c) => console.log('___CHAPTERS___', c)),
    map((chapters) => receivedChapters({ chapters }))
  ))

  constructor(
    private actions$: Actions,
    private uploadService: UploadPhotoService,
    private store: Store<any>
  ) {
  }
}
