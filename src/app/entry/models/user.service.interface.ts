import {Observable} from "rxjs";
import {User} from "../../models/user";

export interface UserServiceInterface {
  getUsers(): Observable<User[]>;
  createUser(user: User): Observable<User>;
  editUser(user: User): Observable<User>;
  deleteUser(userId: string): Observable<string>;
}
