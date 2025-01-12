import { Observable } from 'rxjs';
import { Role } from '../../models/role';

export interface RoleServiceInterface {
  getRoles(): Observable<Role[]>;
  createRole(role: Role): Observable<Role>;
  editRole(role: Role): Observable<Role>;
  deleteRole(roleId: string): Observable<string>;
}
