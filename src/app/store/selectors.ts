import {createFeatureSelector, createSelector} from "@ngrx/store";
import {Chapter} from "../models/chapter";


export const gallerySelector = createFeatureSelector<{ chapters: Chapter[] }>('gallery');

export const chaptersSelector = createSelector(gallerySelector, (state: { chapters: Chapter[] }) => state.chapters);
