import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Role } from '../../models/role';
import { RoleServiceInterface } from '../models/role.service.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService implements RoleServiceInterface {
  private url = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.url}`, role);
  }

  editRole(role: Role): Observable<Role> {
    return this.http.put<Role>(this.url, {});
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.url);
  }

  deleteRole(roleId: string): Observable<string> {
    return this.http.delete<string>(`${this.url}/${roleId}`);
  }
}
