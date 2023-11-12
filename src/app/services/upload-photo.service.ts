import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { IUploadPhotoService } from '../models/services/upload-photo-service';
import { CreateChapter } from '../models/dto/create-chapter';
import { environment } from '../../environments/environment';
import { Photo } from '../models/photo';
import {Chapter} from "../models/chapter";

@Injectable({ providedIn: 'root' })
export class UploadPhotoService implements IUploadPhotoService {

  constructor(
    private http: HttpClient,
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
    formData.append('name', name);

    if (photo.payload.description) {
      const { description } = photo.payload;
      formData.append('description', description);
    }

    if (photo.payload.chapter) {

      const { chapter } = photo.payload;
      formData.append('chapter', chapter);
      let headers = new HttpHeaders();
      headers = headers.set('chapterName', photo.payload.chapterName!!);

      return this.http.post(url, formData, { responseType: 'text', reportProgress: true, headers });
    }

    return this.http.post(url, formData, { responseType: 'text', reportProgress: true });
  }

  createChapter(chapter: { payload: CreateChapter }): Observable<any> {
    const url = `${environment.apiUrl}/upload-photo/createchapter`;
    return this.http.post(url, chapter.payload);
  }

  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.apiUrl}/upload-photo/photos`);
  }

  // TODO ass type
  getChapters(): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${environment.apiUrl}/upload-photo/chapters`).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          console.log('Hi, please do authorization, it\'s me, Vasya:)', error);
        }
        return of([]);
      })
    );
  }
}
