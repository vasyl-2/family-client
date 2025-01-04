import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { UserServiceInterface } from './models/user.service.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService implements UserServiceInterface {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  createUser(user: User): Observable<User> {
    console.log('USER___ACTION___', user);
    return this.http.post<User>(`${environment.apiUrl}/users`, user);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users`, user);
  }

  deleteUser(userId: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiUrl}/users`, {
      body: { id: userId },
    });
  }
}
