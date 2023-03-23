import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {IUploadPhotoService} from "../models/services/upload-photo-service";
import {Chapter} from "../models/chapter";
import {CreateChapter} from "../models/dto/create-chapter";

@Injectable({ providedIn: 'root' })
export class UploadPhotoService implements IUploadPhotoService {

  prefix = ''
  constructor(
    private http: HttpClient
  ) { }

  uploadPhoto(photo: any): Observable<any> {
    console.log('PHOTO_________', photo);

    return this.http.post(`/uploadphoto`, {

    });

  }

  createChapter(chapter: CreateChapter): Observable<any> {

    return of('');
  }
}
