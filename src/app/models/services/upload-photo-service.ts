import {Observable} from "rxjs";

export interface IUploadPhotoService {
  uploadPhoto(photo: any): Observable<any>;
}
