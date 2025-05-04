import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

import { GalleryState } from '../../store/reducer';
import { permissionsForUserLoaded } from '../../store/selectors';

@Injectable({
  providedIn: 'root',
})
export class RbacIsReadyGuard {
  constructor(private store: Store<GalleryState>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.store.pipe(
      select(permissionsForUserLoaded),
      // filter((loaded: boolean) => loaded !== null && loaded !== undefined)
      filter((loaded: boolean) => loaded),
    );
  }
}
