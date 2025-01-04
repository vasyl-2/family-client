import { Observable } from 'rxjs';
import { Permission } from '../permission';

export interface PermissionServiceInterface {
  getPermissions(): Observable<Permission[]>;
}
