import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

import { IUploadPhotoService } from "../models/services/upload-photo-service";
import { CreateChapter } from "../models/dto/create-chapter";
import { environment } from "../../environments/environment";
import { Photo } from "../models/photo";

@Injectable({ providedIn: 'root' })
export class UploadPhotoService implements IUploadPhotoService {

  constructor(
    private http: HttpClient
  ) { }

  uploadPhoto(photo: { payload: Photo }): Observable<any> {
    const url = `${environment.apiUrl}/upload-photo/uploadfile`;
    const file = photo.payload.photo;
    let { name } = file;

    if (photo.payload.name) {
      const extension = name.split('.').at(-1);
      name = `${photo.payload.name}.${extension}`;
    }

    const formData = new FormData();
    formData.append('photo', file, name);


    console.log('PHOTO______________________', photo.payload);
    if (photo.payload.chapter) {
      const { chapter } = photo.payload;
      formData.append('chapter', chapter);
    }

    if (photo.payload.description) {
      const { description } = photo.payload;
      formData.append('description', description);
    }

    return this.http.post(url, formData, { responseType: 'text', reportProgress: true });
  }

  createChapter(chapter: CreateChapter): Observable<any> {

    return of('');
  }

  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.apiUrl}/upload-photo/photos`);
  }

  getChapters(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/upload-photo/chapters`);
  }
}
