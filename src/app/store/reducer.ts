import { createReducer, on } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { cloneDeep } from 'lodash';

import {
  createdPhoto,
  receivedChapters,
  receivedPhotos,
  authenticated,
  authenticateAlert,
  authenticateAlertHide,
  logout,
  createdVideo,
  receivedVideos
} from './action';
import { Chapter } from '../models/chapter';
import { Photo } from '../models/photo';
import { Video } from "../models/video";

export interface GalleryState {
  chapters: Chapter[];
  hierarchyChapters: Chapter[];
  photos?: Photo[];
  videos?: Video[];
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
  hierarchyChapters: [] as Chapter[],
  // photos: [] as Photo[],
  auth: {
    showAlert: true,
    authenticated: false,
  }
}

export const mainReducer = createReducer(
  GALLERY_INIT_STATE,

  on(createdPhoto, (state: GalleryState, action) => {
    console.log('DONE________PHOTO____________', JSON.parse(action.photo));
    return state;
  }),

  on(createdVideo, (state: GalleryState, action) => {
    console.log('DONE________VIDEO____________', JSON.parse(action.video));
    return state;
  }),

  immerOn(receivedChapters, (state: GalleryState, action) => {

    const newChapters = cloneDeep(action.chapters);
    const hierarchy = buildHierarchyTree(newChapters, '');
    const newState = { ...state, chapters: action.chapters, hierarchyChapters: hierarchy };
    return newState;
  }),

  on(receivedPhotos, (state: GalleryState, action) => {

    const newState = { ...state, photos: action.photos };
    return newState;
  }),

  on(receivedVideos, (state: GalleryState, action) => {

    const newState = { ...state, photos: action.videos };
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

  on(logout, (state: GalleryState, action) => {
    const s = { ...state, auth: { ...state.auth, authenticated: false }};
    return s;
  }),

)

function buildHierarchyTree(chapters: Chapter[], parentId: string | undefined) {
  const tree: Chapter[] = [];

  chapters.forEach((item: Chapter) => {
    item.highlighted = false;
    if (item.parent === parentId) {
      const children = buildHierarchyTree(chapters, item._id);

      if (children.length) {
        item.children = children;
      }

      tree.push(item);
    }
  });

  return tree;
}
