import {Observable} from "rxjs";
import {Permission} from "../../models/permission";

export interface PermissionsServiceInterface {
  getPermissions(): Observable<Permission[]>;
  createPermission(): Observable<Permission>;
  editPermission(): Observable<Permission>;
  deletePermission(): Observable<string>;
}
