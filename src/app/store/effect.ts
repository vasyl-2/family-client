import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';

import {
  authenticated,
  CREATE_ACTION,
  CREATE_PHOTO_ACTION,
  CREATE_VIDEO_ACTION,
  CREATE_VIDEO_CHAPTER_ACTION,
  createdPhoto,
  createdVideo,
  EDIT_PHOTO_ACTION,
  editedPhoto,
  RECEIVE_ALL_PHOTOS,
  RECEIVE_ALL_VIDEOS,
  RECEIVE_CHAPTERS,
  RECEIVE_VIDEO_CHAPTERS,
  receivedChapters,
  receivedPhotos,
  receivedVideoChapters,
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
  CREATE_USER,
  createdUser,
  RECEIVE_ROLES,
  EDIT_USER,
  LOGIN,
  LOAD_PERMISSIONS,
  RECEIVE_PERMISSIONS_BY_USER,
  RECEIVE_PERMISSIONS,
  gotPermissionsByUser,
  RECEIVED_PERMISSIONS_BY_USER, gotPermissions, CREATE_ROLE, createdRole, EDIT_VIDEO_ACTION, editedVideo,
} from './action';

import { CreateChapter } from '../models/dto/create-chapter';
import { Photo } from '../models/photo';
import { Chapter } from '../models/chapter';
import { Video } from '../models/video';

import { AuthorizationService } from '../services/authorization/authorization.service';
import { UploadPhotoService } from '../services/upload-photo.service';
import { UserService } from '../entry/user.service';
import { User } from '../models/user';
import { RoleService } from '../entry/services/role.service';
import { Role } from '../models/role';
import { PermissionsService } from '../services/permissions.service';
import { Permission } from '../models/permission';
import { NgxPermissionsService } from 'ngx-permissions';
import {PermissionService} from "../entry/services/permission.service";

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

  createVideoChapter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_VIDEO_CHAPTER_ACTION),
      exhaustMap((chapter: { payload: CreateChapter }) =>
        this.uploadService.createVideoChapter(chapter),
      ),
      map((chapters: Chapter[]) => receivedVideoChapters({ chapters })),
      catchError(() => EMPTY),
    ),
  );

  createPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_PHOTO_ACTION),
      tap((x) => console.log('CREATE__________________PHOTO', x)),
      exhaustMap((photo: { payload: Photo }) => {
        return this.uploadService.uploadPhoto(photo);
      }),
      map((photo: any) => createdPhoto({ photo })),
      catchError(() => EMPTY),
    ),
  );

  updatePhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EDIT_PHOTO_ACTION),
      tap((x) => console.log('UPDATE_________________PHOTO', x)),
      exhaustMap((photo: { photo: Partial<Photo> }) => {
        return this.uploadService.updatePhoto(photo.photo);
      }),
      tap((p) => console.log('EDITED___PHOTO_________', p)),
      map((photo: any) => editedPhoto({ photo })),
      catchError(() => EMPTY),
    ),
  );

  updateVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EDIT_VIDEO_ACTION),
      tap((x) => console.log('UPDATE_________________VIDEO', x)),
      exhaustMap((video: { video: Partial<Video> }) => {
        return this.uploadService.updateVideo(video.video);
      }),
      tap((p) => console.log('EDITED___VIDEO_________', p)),
      map((video: any) => editedVideo({ video })),
      catchError(() => EMPTY),
    ),
  );

  createVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_VIDEO_ACTION),
      tap((video) => console.log('CREATE__________________VIDEO', video)),
      exhaustMap((video: { payload: Video }) => {
        return this.uploadService.uploadVideo(video);
      }),
      map((video: any) => createdVideo({ video })), // TODO change from any!!!
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

  receiveVideoChapters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_VIDEO_CHAPTERS),
      exhaustMap((chapters) => this.uploadService.getVideoChapters()),
      map((chapters: Chapter[]) => receivedVideoChapters({ chapters })),
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
      tap((u) => console.log('TEST__________', u)),
      map((users: User[]) => gotUsers({ users })),
    ),
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_USER),
      exhaustMap(({ user }: { user: User }) =>
        this.userService.createUser(user),
      ),
      tap((u) => console.log('TEST__________', u)),
      map((user: User) => createdUser({ user })),
    ),
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_ROLE),
      exhaustMap(({ role }: { role: Role }) =>
        this.roleService.createRole(role),
      ),
      tap((u) => console.log('ROLE__CREATED_!!__________', u)),
      map((role: Role) => createdRole({ role })),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EDIT_USER),
      exhaustMap(({ user }: { user: User }) => this.userService.editUser(user)),
      tap((u) => console.log('EDITED____USER______', u)),
      map((user: User) => createdUser({ user })),
    ),
  );

  // ROLES
  getRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RECEIVE_ROLES),
      exhaustMap(() => this.roleService.getRoles()),
      tap((roles) => console.log('ROLES__________', roles)),
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
        console.log('PERMISSIONS___BY___SERVICE____2', permissions);
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
