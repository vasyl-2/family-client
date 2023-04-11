import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";

import {UploadPhotoService} from "../../services/upload-photo.service";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit, OnDestroy {

  private readonly photosSubject = new BehaviorSubject(undefined);
  public readonly photos$ = this.photosSubject.asObservable();

  private sub = new Subscription();

  constructor(
    private uploadPhotoService: UploadPhotoService,
  ) {
  }

  ngOnInit() {
    this.getAllPhotos();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAllPhotos(): void {
    this.sub.add(
      this.uploadPhotoService.getAllPhotos().subscribe((resp) => this.photosSubject.next(resp))
    )

  }
}
