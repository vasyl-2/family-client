import { Observable } from 'rxjs';
import { Role } from '../../models/role';

export interface RoleServiceInterface {
  getRoles(): Observable<Role[]>;
  createRole(): Observable<Role>;
  editRole(): Observable<Role>;
  deleteRole(): Observable<string>;
}
