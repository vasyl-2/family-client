import {createAction, props} from '@ngrx/store';
import {Chapter} from "../models/chapter";
import {CreateChapter} from "../models/dto/create-chapter";
import {Photo} from "../models/photo";

export const CREATE_ACTION = '[Gallery] CREATE';
export const CREATED_ACTION = '[Gallery] CREATED';

export const CREATE_PHOTO_ACTION = '[Gallery] CREATE PHOTO';
export const CREATED_PHOTO_ACTION = '[Gallery] CREATED PHOTO';

export const RECEIVE_CHAPTERS = '[CHAPTERS] RECEIVE CHAPTERS';
export const RECEIVED_CHAPTERS = '[CHAPTERS] RECEIVED CHAPTERS';

export const RECEIVE_ALL_PHOTOS = '[PHOTOS] RECEIVE PHOTOS';
export const RECEIVED_ALL_PHOTOS = '[PHOTOS] RECEIVED PHOTOS';

export const createChapter = createAction(
  CREATE_ACTION,
  props<{ payload: CreateChapter }>()
);

export const createdChapter = createAction(
  CREATED_ACTION,
  props<{ chapter: Chapter }>()
);

export const createPhoto = createAction(
  CREATE_PHOTO_ACTION,
  props<{ payload: Photo }>()
);

export const createdPhoto = createAction(
  CREATED_PHOTO_ACTION,
  props<{ photo: any }>()
);

export const receiveChapters = createAction(
  RECEIVE_CHAPTERS,
);

export const receivedChapters = createAction(
  RECEIVED_CHAPTERS,
  props<{ chapters: { title: string, _id: string, readable_id?: string }[] }>()
);

export const receivePhotos = createAction(
  RECEIVE_ALL_PHOTOS,
);

export const receivedPhotos = createAction(
  RECEIVED_ALL_PHOTOS,
  props<{ photos: Photo[] }>()
);


