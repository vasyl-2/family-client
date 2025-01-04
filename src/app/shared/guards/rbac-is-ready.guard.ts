import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { GalleryState } from '../../store/reducer';
import { permissionsForUserLoaded } from '../../store/selectors';

@Injectable({
  providedIn: 'root',
})
export class RbacIsReadyGuard implements CanActivate {
  constructor(private store: Store<GalleryState>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.store.pipe(
      select(permissionsForUserLoaded),
      tap((p) => console.log('WHAT__IS____1', p)),
      tap((loaded) =>
        console.log('WHAT__IS____2', loaded !== null && loaded !== undefined),
      ),
      // filter((loaded: boolean) => loaded !== null && loaded !== undefined)
      filter((loaded: boolean) => loaded),
    );
  }
}
