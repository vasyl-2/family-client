import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/auth`);
  }

  createUser(): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth`, {});
  }

  editUser(): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/auth`, {});
  }
}
