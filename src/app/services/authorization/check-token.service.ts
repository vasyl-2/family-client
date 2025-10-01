import { Injectable } from '@angular/core';
import {
  authenticateAlertHide,
  authenticated,
  getPermissions,
  getPermissionsByUser,
  receiveChapters,
} from '../../store/action';
import { Store } from '@ngrx/store';
import { GalleryState } from '../../store/reducer';
import { BehaviorSubject } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class CheckTokenService {
  readonly isAdminSubject = new BehaviorSubject(false);
  readonly isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private store: Store<GalleryState>,
    private permissionService: NgxPermissionsService,
  ) {}

  checkToken(): void {
    const token = localStorage.getItem('auth');

    if (!!token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isNotExp = Date.now() / 1000 < payload.exp; // // jwt exp typically in seconds while Date.now() in milliseconds

      if (isNotExp) {
        this.store.dispatch(receiveChapters());

        const { permissions = undefined } = payload;

        if (permissions && Array.isArray(permissions) && permissions.length) {
          this.store.dispatch(getPermissionsByUser());
        }

        const item: { token: string; isAdmin?: boolean } = {
          token: localStorage.getItem('auth') as string,
        };

        if (payload.email) {
          if (payload.email === 'admin2') {
            item.isAdmin = true;
          } else {
            item.isAdmin = false;
          }
        } else {
          item.isAdmin = false;
        }

        this.isAdminSubject.next(item.isAdmin);

        this.store.dispatch(authenticated(item));
        this.store.dispatch(authenticateAlertHide());
      } else {
        localStorage.removeItem('auth');
      }
    }
  }
}
