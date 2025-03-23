import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GalleryState } from '../../store/reducer';
import { Store } from '@ngrx/store';
import { authenticateAlertHide, authenticated } from '../../store/action';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private isLoggedInSubject = new BehaviorSubject(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store<GalleryState>,
  ) {}

  login(creds: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{
        access_token: string;
      }>(`${environment.apiUrl}/auth/authenticate`, creds)
      .pipe(
        filter((resp: { access_token: string }) => !!resp),
        tap((resp) => this.isLoggedInSubject.next(true)),
        tap((resp: { access_token: string }) =>
          console.log('resp.access_token_________________', resp.access_token),
        ),
        tap((resp: { access_token: string }) => localStorage.setItem('auth', resp.access_token)), // !!!!! here we set token
        tap((resp) => this.store.dispatch(authenticateAlertHide())),
        tap((resp) =>
          this.store.dispatch(authenticated({ token: resp.access_token })),
        ),
      );
  }
}
