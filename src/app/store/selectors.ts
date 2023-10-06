import { createFeatureSelector, createSelector } from "@ngrx/store";

import { GalleryState } from "./reducer";

// StoreModule.forRoot({ gallery: mainReducer }),  - so the gallery name
// In feature module i.e. - StoreModule.forFeature({ featureOne: smth }) it would be ('smth')
export const gallerySelector = createFeatureSelector<GalleryState>('gallery');

export const chaptersSelector = createSelector(gallerySelector, (state: GalleryState) => state.chapters);
export const photosSelector = createSelector(gallerySelector, (state: GalleryState) => state.photos);
export const alertSelector = createSelector(gallerySelector, (state: GalleryState) => state.auth.showAlert);
export const isAuthenticated = createSelector(gallerySelector, (state: GalleryState) => state.auth.authenticated);
