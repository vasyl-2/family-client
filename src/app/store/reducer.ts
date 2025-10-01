import { ActionReducerMap, createReducer, on } from '@ngrx/store';
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
  receivedVideos,
  getUsers,
  gotUsers,
  createUser,
  editUser,
  getRoles,
  gotRoles,
  createRole,
  editRole,
  RECEIVE_USERS,
  gotPermissionsByUser,
  gotPermissions,
  createdRole,
  createdUser,
  editedVideo, receivedPdfs,
} from './action';
import { Chapter } from '../models/chapter';
import {PhotoMedia} from '../models/photo';
import {VideoMedia} from '../models/video';
import { RouterStateUrl } from '../models/router-utils';
import { User } from '../models/user';
import { Role } from '../models/role';
import { Permission } from '../models/permission';
import {ViewSettings} from "../models/view-settings";
import {PdfMedia} from "../models/pdf";

export interface GalleryState {
  chapters: Chapter[];
  hierarchyChapters: Chapter[];
  videoChapters: Chapter[];
  videoHierarchyChapters: Chapter[];
  photos?: PhotoMedia[];
  videos?: VideoMedia[];
  docs?: PdfMedia[];
  auth: {
    authenticated: boolean;
    showAlert: boolean;
    user?: {
      name?: string;
      email?: string;
      roles?: string[];
      permissions?: Permission[] | undefined;
    };
    permissionsLoaded: boolean;
  };
  admin: {
    users?: User[];
    roles?: Role[];
    permissions?: Permission[];
  };
  viewSettings: ViewSettings;
}

export const GALLERY_INIT_STATE: GalleryState = {
  chapters: [] as Chapter[],
  hierarchyChapters: [] as Chapter[],
  videoChapters: [] as Chapter[],
  videoHierarchyChapters: [] as Chapter[],
  auth: {
    showAlert: true,
    authenticated: false,
    permissionsLoaded: false,
  },
  admin: {},
  viewSettings: {
    sorted: 'desc',
    paramSOrtBy: 'date'
  }
};

export const mainReducer = createReducer(
  GALLERY_INIT_STATE,

  // on(createdPhoto, (state: GalleryState, action): GalleryState => {
  //   return state;
  // }),
  //
  // on(createdVideo, (state: GalleryState, action): GalleryState => {
  //   return state;
  // }),

  immerOn(receivedChapters, (state: GalleryState, action): GalleryState => {
    const newChapters = cloneDeep(action.chapters);
    const hierarchy = buildHierarchyTree(newChapters, '', '');
    return {
      ...state,
      chapters: action.chapters,
      hierarchyChapters: hierarchy,
    };
  }),

  immerOn(
    receivedVideoChapters,
    (state: GalleryState, action): GalleryState => {
      const newChapters = cloneDeep(action.chapters);
      const hierarchy = buildHierarchyTree(newChapters, '', '');
      return {
        ...state,
        videoChapters: action.chapters,
        videoHierarchyChapters: hierarchy,
      };
    },
  ),

  on(receivedPhotos, (state: GalleryState, action): GalleryState => {
    return { ...state, photos: action.photos };
  }),

  on(receivedPdfs, (state: GalleryState, action): GalleryState => {
    return { ...state, docs: action.docs };
  }),

  on(receivedVideos, (state: GalleryState, action): GalleryState => {
    return { ...state, videos: action.videos };
  }),

  immerOn(gotUsers, (state: GalleryState, action): void => {
    state.admin.users = action.users;
  }),

  immerOn(createdRole, (state: GalleryState, action): void => {
    state.admin.roles?.push(action.role);
  }),

  immerOn(createdUser, (state: GalleryState, action): void => {
    state.admin.users?.push(action.user);
  }),

  immerOn(gotRoles, (state: GalleryState, action): void => {
    state.admin.roles = action.roles;
  }),

  immerOn(gotPermissionsByUser, (state: GalleryState, action) => {
    state.auth.user = { permissions: action.permissions };
    state.auth.permissionsLoaded = true;
  }),

  immerOn(gotPermissions, (state: GalleryState, action) => {
    state.admin.permissions = action.permissions;
  }),

  // on(gotUsers, (state: GalleryState, action): GalleryState => {
  //
  //   const newAdmin = state.admin;
  //   newAdmin.users = action.users;
  //   const newState = { ...state, admin: newAdmin }
  //   console.log('ACTION_____', action)
  //
  //   return newState;
  // }),

  on(authenticateAlert, (state: GalleryState, action): GalleryState => {
    return { ...state, auth: { ...state.auth, showAlert: true } };
  }),

  on(authenticateAlertHide, (state: GalleryState, action): GalleryState => {
    return { ...state, auth: { ...state.auth, showAlert: false } };
  }),

  on(authenticated, (state: GalleryState, action): GalleryState => {
    return { ...state, auth: { ...state.auth, authenticated: true } };
  }),

  on(logout, (state: GalleryState, action): GalleryState => {
    const s = { ...state, auth: { ...state.auth, authenticated: false } };
    return s;
  }),
);

function buildHierarchyTree(
  chapters: Chapter[],
  parentId: string | undefined,
  parentTitle: string | undefined,
) {
  const tree: Chapter[] = [];

  chapters.forEach((item: Chapter) => {
    item.highlighted = false;
    if (item.parent === parentId) {
      if (parentTitle) {
        item.parentTitle = parentTitle;
      }

      const children = buildHierarchyTree(chapters, item._id, item.nameForUI);

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
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const actionReducers: ActionReducerMap<State> = {
  gallery: mainReducer,
  router: fromRouter.routerReducer,
};
