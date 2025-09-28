import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { IUploadPhotoService } from '../models/services/upload-photo-service';
import { CreateChapter } from '../models/dto/create-chapter';
import { environment } from '../../environments/environment';
import { Photo } from '../models/photo';
import { Chapter } from '../models/chapter';
import { Video } from '../models/video';
import {Pdf} from "../models/pdf";
import {MediaCreateResponse} from "../models/dto/response-create";

@Injectable({ providedIn: 'root' })
export class UploadPhotoService implements IUploadPhotoService {
  constructor(private http: HttpClient) {}

  uploadPhoto(media: { payload: Photo }): Observable<MediaCreateResponse> {
    const url = `${environment.apiUrl}/upload-photo/uploadfile`;
    const file = media.payload.photo!;

    let { name } = file;

    if (media.payload.name) {
      const extension = name.split('.').at(-1);
      name = `${media.payload.name}.${extension}`;
    }

    const formData = new FormData();
    formData.append('photo', file, name);
    formData.append('name', name);

    if (media.payload.description) {
      const { description } = media.payload;
      formData.append('description', description!);
    }

    if (media.payload.fullPath) {
      const { fullPath } = media.payload;
      formData.append('fullPath', fullPath!);
    }

    if (media.payload.date) {
      const { date } = media.payload;
      formData.append('date', date!.toISOString());
    }

    if (media.payload.chapter) {
      const { chapter } = media.payload;
      formData.append('chapter', chapter!);
      let headers = new HttpHeaders();
      let { chapterName, fullPath = undefined } = media.payload;

      if (fullPath) {
        chapterName = `${fullPath}`;
      }
      headers = headers.set('chapterName', chapterName!!);

      return this.http.post<MediaCreateResponse>(url, formData, {
        reportProgress: true,
        headers,
      });
    }

    return this.http.post<MediaCreateResponse>(url, formData, {
      reportProgress: true,
    });
  }

  uploadDoc(media: { payload: Pdf }): Observable<MediaCreateResponse> {
    const url = `${environment.apiUrl}/upload-photo/uploadpdf`;
    const file = media.payload.pdf!;

    let { name } = file;


    if (media.payload.name) {
      const extension = name.split('.').at(-1);
      name = `${media.payload.name}.${extension}`;
    }


    const formData = new FormData();
    formData.append('doc', file, name);
    formData.append('name', name);

    if (media.payload.description) {
      const { description } = media.payload;
      formData.append('description', description!);
    }

    if (media.payload.fullPath) {
      const { fullPath } = media.payload;
      formData.append('fullPath', fullPath!);
    }

    if (media.payload.date) {
      const { date } = media.payload;
      formData.append('date', date!.toISOString());
    }

    if (media.payload.chapter) {
      const { chapter } = media.payload;
      formData.append('chapter', chapter!);
      let headers = new HttpHeaders();
      let { chapterName, fullPath = undefined } = media.payload;

      if (fullPath) {
        chapterName = `${fullPath}`;
      }
      headers = headers.set('chapterName', chapterName!!);

      return this.http.post<MediaCreateResponse>(url, formData, {
        reportProgress: true,
        headers,
      });
    }

    return this.http.post<MediaCreateResponse>(url, formData, {
      reportProgress: true,
    });
  }

  updatePhoto(photo: Partial<Photo>) {
    const url = `${environment.apiUrl}/upload-photo/updatephoto/${photo._id}`;
    return this.http.patch(url, { photo });
  }

  updateVideo(video: Partial<Video>) {
    const url = `${environment.apiUrl}/upload-photo/updatevideo/${video._id}`;
    return this.http.patch(url, { video });
  }

  uploadVideo(video: { payload: Video }): Observable<MediaCreateResponse> {
    const url = `${environment.apiUrl}/upload-photo/uploadvideo`;
    const file = video.payload.video!;

    let { name } = file;

    if (video.payload.name) {
      const extension = name.split('.').at(-1);
      name = `${video.payload.name}.${extension}`;
    }

    const formData = new FormData();
    formData.append('video', file, name);
    formData.append('name', name);

    if (video.payload.description) {
      const { description } = video.payload;
      formData.append('description', description!);
    }

    if (video.payload.date) {
      const { date } = video.payload;
      formData.append('date', date!.toISOString());
    }

    if (video.payload.fullPath) {
      const { fullPath } = video.payload;
      formData.append('fullPath', fullPath!);
    }

    if (video.payload.chapter) {
      const { chapter } = video.payload;
      formData.append('chapter', chapter!);
      let headers = new HttpHeaders();
      let { chapterName, fullPath = undefined } = video.payload;

      if (fullPath) {
        chapterName = `${fullPath}`;
      }
      headers = headers.set('chapterName', chapterName!!);

      return this.http.post<MediaCreateResponse>(url, formData, {
        reportProgress: true,
        headers,
      });
    }

    return this.http.post<MediaCreateResponse>(url, formData, {
      reportProgress: true,
    });
  }

  createChapter(chapter: { payload: CreateChapter }): Observable<any> {
    const url = `${environment.apiUrl}/upload-photo/createchapter`;
    return this.http.post(url, chapter.payload);
  }

  createVideoChapter(chapter: { payload: CreateChapter }): Observable<any> {
    const url = `${environment.apiUrl}/upload-photo/createvideochapter`;
    return this.http.post(url, chapter.payload);
  }

  getAllPhotos(chapter: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(
      `${environment.apiUrl}/upload-photo/photoslist/${chapter}`,
    );
  }

  getAllVideos(chapter: string): Observable<Video[]> {
    return this.http.get<Video[]>(
      `${environment.apiUrl}/upload-photo/videolist/${chapter}`,
    );
  }

  getAllPdfs(chapter: string): Observable<Pdf[]> {
    return this.http.get<Pdf[]>(
      `${environment.apiUrl}/upload-photo/pdflist/${chapter}`,
    );
  }

  getAllPhotosList(chapter: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(
      `${environment.apiUrl}/upload-photo/photos/${chapter}`,
    );
  }

  // TODO add type
  getChapters(): Observable<Chapter[]> {
    return this.http
      .get<Chapter[]>(`${environment.apiUrl}/upload-photo/chapters`)
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            console.log('Hi, please do authorization)', error);
          }
          return of([]);
        }),
      );
  }

  getVideoChapters(): Observable<Chapter[]> {
    return this.http
      .get<Chapter[]>(`${environment.apiUrl}/upload-photo/video-chapters`)
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            console.log('Hi, please do authorization)', error);
          }
          return of([]);
        }),
      );
  }
}
