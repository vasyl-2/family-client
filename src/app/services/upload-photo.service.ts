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
    const file = photo.payload;
    const { name } = file;
    console.log('PHOTO_____1', file);
    console.log('PHOTO_____2', name);

    let reader = new FileReader();

    const formData = new FormData();
    formData.append('photo', file, name);

    const body = {
      image: formData
    };

    console.log('BODY______________', formData);

    return this.http.post(`${environment.apiUrl}/upload-photo/uploadfile`, formData, { responseType: 'text', reportProgress: true });
    // return of({ hi: 'HI_____________' });
  }

  createChapter(chapter: CreateChapter): Observable<any> {

    return of('');
  }

  getAllPhotos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/photos`);
  }
}
