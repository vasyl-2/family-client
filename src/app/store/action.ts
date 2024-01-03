import {createAction, props} from '@ngrx/store';

import {Chapter} from "../models/chapter";
import {CreateChapter} from "../models/dto/create-chapter";
import {Photo} from "../models/photo";
import {Video} from "../models/video";

export const CREATE_ACTION = '[Gallery] CREATE';
export const CREATED_ACTION = '[Gallery] CREATED';

export const CREATE_PHOTO_ACTION = '[Gallery] CREATE PHOTO';
export const CREATED_PHOTO_ACTION = '[Gallery] CREATED PHOTO';

export const CREATE_VIDEO_ACTION = '[Gallery] CREATE VIDEO';
export const CREATED_VIDEO_ACTION = '[Gallery] CREATED VIDEO';

export const RECEIVE_CHAPTERS = '[CHAPTERS] RECEIVE CHAPTERS';
export const RECEIVED_CHAPTERS = '[CHAPTERS] RECEIVED CHAPTERS';

export const RECEIVE_ALL_PHOTOS = '[PHOTOS] RECEIVE PHOTOS';
export const RECEIVED_ALL_PHOTOS = '[PHOTOS] RECEIVED PHOTOS';

export const RECEIVE_ALL_VIDEOS = '[PHOTOS] RECEIVE VIDEOS';
export const RECEIVED_ALL_VIDEOS = '[PHOTOS] RECEIVED VIDEOS';

export const AUTHENTICATE = '[AUTHENTICATE] AUTHENTICATE';
export const LOGOUT = '[AUTHENTICATE] AUTHENTICATE LOGOUT';
export const AUTHENTICATE_SUCCESS = '[AUTHENTICATE] AUTHENTICATE SUCCESS';
export const AUTHENTICATE_ERROR = '[AUTHENTICATE] AUTHENTICATE ERROR';

export const SHOW_AUTHENTICATION_ALERT = '[AUTHENTICATE] SHOW ALERT';
export const AUTHENTICATION_ALERT_HIDE = '[AUTHENTICATE] SHOW ALERT HIDE';

export const createChapter = createAction(
  CREATE_ACTION,
  props<{ payload: CreateChapter }>()
);

export const createdChapter = createAction(
  CREATED_ACTION,
  props<{ chapter: Chapter }>()
);

// ==================**** PHOTO *** ========================
export const createPhoto = createAction(
  CREATE_PHOTO_ACTION,
  props<{ payload: Photo }>()
);

export const createdPhoto = createAction(
  CREATED_PHOTO_ACTION,
  props<{ photo: any }>() // TODO change from any
);
// ==============END PHOTO ================================

// =============== *** VIDEO *** ==========================
export const createVideo = createAction(
  CREATE_VIDEO_ACTION,
  props<{ payload: Video }>()
);

export const createdVideo = createAction(
  CREATED_VIDEO_ACTION,
  props<{ video: any }>() // TODO change from any
);

// ================ END VIDEO ==========================
export const receiveChapters = createAction(
  RECEIVE_CHAPTERS,
);

export const receivedChapters = createAction(
  RECEIVED_CHAPTERS,
  props<{ chapters: Chapter[] }>()
);


// =================== GET PHOTOS *** ===============================
export const receivePhotos = createAction(
  RECEIVE_ALL_PHOTOS,
  props<{ chapter: string }>()
);

export const receivedPhotos = createAction(
  RECEIVED_ALL_PHOTOS,
  props<{ photos: Photo[] }>()
);

// END RECEIVE PHOTOS  ======================================

// RECEIVE VIDEOS *** ==================================
export const receiveVideos = createAction(
  RECEIVE_ALL_VIDEOS,
  props<{ chapter: string }>()
);

export const receivedVideos = createAction(
  RECEIVED_ALL_VIDEOS,
  props<{ videos: Video[] }>()
);

// END RECEIVE VIDEOS =================================

export const authenticate = createAction(
  AUTHENTICATE,
  props<{ credentials: { email: string; password: string; } }>()
);

export const logout = createAction(
  LOGOUT
);

export const authenticated = createAction(
  AUTHENTICATE_SUCCESS,
  props<{ token: string }>()
);

export const authenticateError = createAction(
  AUTHENTICATE_ERROR,
  props<{ authenticated: false; }>()
);

export const authenticateAlert = createAction(
  SHOW_AUTHENTICATION_ALERT,
);

export const authenticateAlertHide = createAction(
  AUTHENTICATION_ALERT_HIDE,
);

