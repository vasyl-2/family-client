import { createReducer, on } from '@ngrx/store';

import { createChapter, createdPhoto, createPhoto, receivedChapters, receivedPhotos } from "./action";
import { Chapter } from "../models/chapter";
import { Photo } from "../models/photo";


export interface GalleryState {
  chapters: Chapter[];
  photos: Photo[];
}

export const GALLERY_INIT_STATE: GalleryState = {
  chapters: [],
  photos: [] as Photo[],
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
  })
)

