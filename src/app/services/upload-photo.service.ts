import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {IUploadPhotoService} from "../models/services/upload-photo-service";
import {Chapter} from "../models/chapter";
import {CreateChapter} from "../models/dto/create-chapter";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UploadPhotoService implements IUploadPhotoService {

  // prefix = 'http://localhost:4200/upload-photo';

  constructor(
    private http: HttpClient
  ) { }

  uploadPhoto(photo: any): Observable<any> {
    const file = photo.payload.fileA;
    const { name } = file;
    console.log('PHOTO_____1', file);
    console.log('PHOTO_____2', name);

    const formData: FormData = new FormData();
    formData.append('file', file, name);

    const body = {
      image: formData
    };

    return this.http.post(`${environment.apiUrl}/upload-photo/uploadfile`, body);
    // return of({ hi: 'HI_____________' });
  }

  createChapter(chapter: CreateChapter): Observable<any> {

    return of('');
  }
}
