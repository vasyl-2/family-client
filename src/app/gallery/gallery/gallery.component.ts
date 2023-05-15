import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";

import {UploadPhotoService} from "../../services/upload-photo.service";
import {GalleryState} from "../../store/reducer";
import {receivePhotos} from "../../store/action";
import {photosSelector} from "../../store/selectors";
import {Photo} from "../../models/photo";


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit, OnDestroy {

  private readonly photosSubject = new BehaviorSubject<Photo[] | undefined>(undefined);
  public readonly photos$ = this.photosSubject.asObservable();

  private sub = new Subscription();

  constructor(
    private uploadPhotoService: UploadPhotoService,
    private store: Store<GalleryState>,
  ) {
  }

  ngOnInit() {
    this.getAllPhotos();

    this.store.pipe(
      select(photosSelector)
    // ).subscribe((photos: Photo[] | undefined) => {
    ).subscribe((p) => {
      console.log('PHOTOS___FROM__SERVER____', p);

      this.photosSubject.next(p);
    })

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAllPhotos(): void {
    console.log('GALLERY_TO__LOAD_____');
    this.store.dispatch(receivePhotos());
  }
}
