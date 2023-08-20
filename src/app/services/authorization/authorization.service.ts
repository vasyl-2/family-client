import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private isLoggedInSubject = new BehaviorSubject(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  authenticate(creds: any): Observable<any> {
    return this.http.post('', creds).pipe(
      filter(resp => !!resp),
      tap(_ => this.isLoggedInSubject.next(true))
    );
  }
}
