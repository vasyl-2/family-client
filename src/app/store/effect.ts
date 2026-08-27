import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import {map, exhaustMap, catchError, tap} from 'rxjs/operators';

import {
  authenticated,
  CREATE_ACTION,
  CREATE_PHOTO_ACTION,
  createdPhoto,
  EDIT_PHOTO_ACTION,
  editedPhoto,
  RECEIVE_ALL_PHOTOS,
  RECEIVE_ALL_VIDEOS,
  RECEIVE_CHAPTERS,
  receivedChapters,
  receivedPhotos,
  receivedVideos,
  gotUsers,
  gotRoles,
  RECEIVE_USERS,
  CREATE_USER,
  createdUser,
  RECEIVE_ROLES,
  EDIT_USER,
  LOGIN,
  RECEIVE_PERMISSIONS_BY_USER,
  RECEIVE_PERMISSIONS,
  gotPermissionsByUser,
  gotPermissions,
  CREATE_ROLE,
  createdRole,
  EDIT_VIDEO_ACTION,
  editedVideo, RECEIVE_ALL_PDFS, receivedPdfs, editedUser,
} from './action';

import { CreateChapter } from '../models/dto/create-chapter';
import {Photo, PhotoMedia} from '../models/photo';
import { Chapter } from '../models/chapter';

import { AuthorizationService } from '../services/authorization/authorization.service';
import { UploadPhotoService } from '../services/upload-photo.service';
import { UserService } from '../entry/user.service';
import { User } from '../models/user';
import { RoleService } from '../entry/services/role.service';
import { Role } from '../models/role';
import { PermissionsService } from '../services/permissions.service';
import { Permission } from '../models/permission';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionService } from '../entry/services/permission.service';
import { MediaCreateResponse } from "../models/dto/response-create";

@Injectable()
export class GalleryEffects {
  createChapter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_ACTION),
      exhaustMap((chapter: { payload: CreateChapter }) =>
        this.uploadService.createChapter(chapter),
      ),
      map((chapters: Chapter[]) => receivedChapters({ chapters })),
      catchError(() => EMPTY),
    ),
  );

  createMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_PHOTO_ACTION),
      exhaustMap((media: { payload: PhotoMedia }) => {
        return this.uploadService.uploadPhoto(media);
      }),
      map((media: MediaCreateResponse) => createdPhoto({ media })),
      catchError(() => EMPTY),
    ),
  );

  updatePhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EDIT_PHOTO_ACTION),
      exhaustMap((photo: { photo: Partial<Photo> }) => {
        return this.uploadService.updatePhoto(photo.photo);
      }),
      map((photo: any) => editedPhoto({ photo })),
      catchError(() => EMPTY),
    ),
  );

  updateVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EDIT_VIDEO_ACTION),
      exhaustMap((video: { video: Partial<PhotoMedia> }) => {
        return this.uploadService.updateVideo(video.video);
      }),
      map((video: any) => editedVideo({ video })),
      catchError(() => EMPTY),
    ),
  );

  receiveChapters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_CHAPTERS),
      exhaustMap((chapters) => this.uploadService.getChapters()),
      map((chapters: Chapter[]) => receivedChapters({ chapters })),
    ),
  );

  getAllPhotos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_ALL_PHOTOS),
      exhaustMap((chapter: { chapter: string }) =>
        this.uploadService.getAllPhotos(chapter.chapter),
      ),
      map((photos) => receivedPhotos({ photos })),
    ),
  );

  getAllPdfs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_ALL_PDFS),
      exhaustMap((chapter: { chapter: string }) =>
        this.uploadService.getAllPdfs(chapter.chapter),
      ),
      map((docs) => receivedPdfs({ docs })),
    ),
  );

  getAllVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_ALL_VIDEOS),
      exhaustMap((chapter: { chapter: string }) =>
        this.uploadService.getAllVideos(chapter.chapter),
      ),
      map((videos) => receivedVideos({ videos })),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN),
      exhaustMap(
        (creds: { credentials: { email: string; password: string } }) =>
          this.authorizationService.login({
            email: creds.credentials.email,
            password: creds.credentials.password,
          }),
      ),
      map((token: string) => authenticated({ token })),
    ),
  );

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_USERS),
      exhaustMap(() => this.userService.getUsers()),
      map((users: User[]) => gotUsers({ users })),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_USER),
      exhaustMap(({ user }: { user: User }) =>
        this.userService.createUser(user),
      ),
      map((user: User) => createdUser({ user })),
    ),
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_ROLE),
      exhaustMap(({ role }: { role: Role }) =>
        this.roleService.createRole(role),
      ),
      map((role: Role) => createdRole({ role })),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EDIT_USER),
      tap((u) => console.log('TEST______', u)),
      exhaustMap(({ user }: { user: User }) => this.userService.editUser(user)),
      map((user: User) => editedUser({ user })),
    ),
  );

  // ROLES
  getRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_ROLES),
      exhaustMap(() => this.roleService.getRoles()),
      map((roles: Role[]) => gotRoles({ roles })),
    ),
  );

  getPermissionsByUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_PERMISSIONS_BY_USER),
      exhaustMap(() => this.permissionsService.getPermissions()),
      map((permissions: Permission[]) => {
        const permissionsNames = permissions.map(
          (perm: Permission) => perm.name,
        );
        this.ngxPermissionsService.loadPermissions(permissionsNames);
        // this.ngxPermissionsService.getPermissions();
        return gotPermissionsByUser({ permissions });
      }),
    ),
  );

  getPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_PERMISSIONS),
      exhaustMap(() => this.permissionService.getPermissions()),
      map((permissions: Permission[]) => {
        const permissionsNames = permissions.map(
          (perm: Permission) => perm.name,
        );
        // this.ngxPermissionsService.loadPermissions(permissionsNames);
        return gotPermissions({ permissions });
      }),
    ),
  );

  //
  // loadPermissions$ = createEffect(() => this.actions$.pipe(
  //   ofType(LOAD_PERMISSIONS),
  //   exhaustMap(() => )
  // ))

  constructor(
    private actions$: Actions,
    private uploadService: UploadPhotoService,
    private authorizationService: AuthorizationService,
    private userService: UserService,
    private roleService: RoleService,
    private permissionsService: PermissionsService,
    private permissionService: PermissionService,
    private ngxPermissionsService: NgxPermissionsService,
  ) {}
}
