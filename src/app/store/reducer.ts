import { createReducer, on } from '@ngrx/store';

import {
  createChapter,
  createdPhoto,
  createPhoto,
  receivedChapters,
  receivedPhotos,
  authenticated,
  authenticateAlert,
  authenticateAlertHide
} from "./action";
import { Chapter } from "../models/chapter";
import { Photo } from "../models/photo";


export interface GalleryState {
  chapters: Chapter[];
  photos: Photo[];
  auth: {
    authenticated: boolean;
    showAlert: boolean;
    user?: {
      name: string;
      email: string;
    }
  }
}

export const GALLERY_INIT_STATE: GalleryState = {
  chapters: [] as Chapter[],
  photos: [] as Photo[],
  auth: {
    showAlert: false,
    authenticated: false,
  }
}

export const mainReducer = createReducer(
  GALLERY_INIT_STATE,
  on(createChapter, (state: GalleryState, action) => {

    console.log('CREATED_________', action);
    return state;
  }),

  on(createdPhoto, (state: GalleryState, action) => {
    console.log('DONE____________________', JSON.parse(action.photo));
    return state;
  }),

  on(receivedChapters, (state: GalleryState, action) => {

    const newState = { ...state, chapters: action.chapters };
    console.log('CHAPTERS______RECEIVED_______', action);
    return newState;
  }),

  on(receivedPhotos, (state: GalleryState, action) => {

    const newState = { ...state, photos: action.photos };
    console.log('PHOTOS______RECEIVED_______', action);
    return newState;
  }),

  on(authenticateAlert, (state: GalleryState, action) => {
    const s = { ...state, auth: { ...state.auth, showAlert: true }};
    return s;
  }),

  on(authenticateAlertHide, (state: GalleryState, action) => {
    const s = { ...state, auth: { ...state.auth, showAlert: false }};
    return s;
  }),

  on(authenticated, (state: GalleryState, action) => {
    const s = { ...state, auth: { ...state.auth, authenticated: true }};
    return s;
  }),

  //
)

