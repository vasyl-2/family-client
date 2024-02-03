import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromRouter from '@ngrx/router-store';

import { GalleryState } from "./reducer";
import { RouterStateUrl } from "../models/router-utils";

// { gallery: mainReducer },  - so the gallery name on top level
// In feature module i.e. - StoreModule.forFeature({ featureOne: smth }) it would be ('smth')
export const gallerySelector = createFeatureSelector<GalleryState>('gallery');

export const chaptersSelector = createSelector(gallerySelector, (state: GalleryState) => state.chapters);
export const chaptersHierarchySelector =
  createSelector(gallerySelector, (state: GalleryState) => state.hierarchyChapters);
export const photosSelector = createSelector(gallerySelector, (state: GalleryState) => state.photos);
export const videosSelector = createSelector(gallerySelector, (state: GalleryState) => state.videos);
export const alertSelector = createSelector(gallerySelector, (state: GalleryState) => state.auth.showAlert);
export const isAuthenticated = createSelector(gallerySelector, (state: GalleryState) => state.auth.authenticated);

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('router');
