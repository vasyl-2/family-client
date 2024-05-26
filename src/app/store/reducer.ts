import {ActionReducerMap, createReducer, on} from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { cloneDeep } from 'lodash';
import * as fromRouter from '@ngrx/router-store';

import {
  createdPhoto,
  receivedChapters,
  receivedVideoChapters,
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
import {RouterStateUrl} from "../models/router-utils";

export interface GalleryState {
  chapters: Chapter[];
  hierarchyChapters: Chapter[];
  videoChapters: Chapter[];
  videoHierarchyChapters: Chapter[];
  photos?: Photo[];
  videos?: Video[];
  auth: {
    authenticated: boolean;
    showAlert: boolean;
    user?: {
      name: string;
      email: string;
    }
  },
}

export const GALLERY_INIT_STATE: GalleryState = {
  chapters: [] as Chapter[],
  hierarchyChapters: [] as Chapter[],
  videoChapters: [] as Chapter[],
  videoHierarchyChapters: [] as Chapter[],
  auth: {
    showAlert: true,
    authenticated: false,
  }
}

export const mainReducer = createReducer(
  GALLERY_INIT_STATE,

  on(createdPhoto, (state: GalleryState, action): GalleryState => {
    return state;
  }),

  on(createdVideo, (state: GalleryState, action): GalleryState => {
    return state;
  }),

  immerOn(receivedChapters, (state: GalleryState, action): GalleryState => {

    const newChapters = cloneDeep(action.chapters);
    const hierarchy = buildHierarchyTree(newChapters, '');
    const newState = { ...state, chapters: action.chapters, hierarchyChapters: hierarchy };
    return newState;
  }),

  immerOn(receivedVideoChapters, (state: GalleryState, action): GalleryState => {

    const newChapters = cloneDeep(action.chapters);
    const hierarchy = buildHierarchyTree(newChapters, '');
    const newState = { ...state, videoChapters: action.chapters, videoHierarchyChapters: hierarchy };
    return newState;
  }),


  on(receivedPhotos, (state: GalleryState, action): GalleryState => {

    const newState = { ...state, photos: action.photos };
    return newState;
  }),

  on(receivedVideos, (state: GalleryState, action): GalleryState => {

    const newState = { ...state, videos: action.videos };
    return newState;
  }),


  on(authenticateAlert, (state: GalleryState, action): GalleryState => {
    const s = { ...state, auth: { ...state.auth, showAlert: true }};
    return s;
  }),

  on(authenticateAlertHide, (state: GalleryState, action): GalleryState => {
    const s = { ...state, auth: { ...state.auth, showAlert: false }};
    return s;
  }),

  on(authenticated, (state: GalleryState, action): GalleryState => {
    const s = { ...state, auth: { ...state.auth, authenticated: true }};
    return s;
  }),

  on(logout, (state: GalleryState, action): GalleryState => {
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

// interface to be passed to the Generic type ActionReducerMap
export interface State {
  gallery: GalleryState;
  router: fromRouter.RouterReducerState<RouterStateUrl>,
}

export const actionReducers: ActionReducerMap<State> = {
  gallery: mainReducer,
  router: fromRouter.routerReducer
}
