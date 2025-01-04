import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PermissionServiceInterface } from '../models/services/permission-service.interface';
import { Permission } from '../models/permission';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService implements PermissionServiceInterface {
  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(
      `${environment.apiUrl}/permissions/user`,
    );
  }
}
