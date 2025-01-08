import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PermissionsServiceInterface } from '../models/permissions.service.interface';
import { Permission } from '../../models/permission';
import {environment} from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PermissionService implements PermissionsServiceInterface {
  constructor(private http: HttpClient) {}

  createPermission(): Observable<Permission> {
    return this.http.post<Permission>('', {});
  }

  editPermission(): Observable<Permission> {
    return this.http.put<Permission>('', {});
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.apiUrl}/permissions`);
  }

  deletePermission(): Observable<string> {
    return this.http.delete<string>('', {});
  }
}
