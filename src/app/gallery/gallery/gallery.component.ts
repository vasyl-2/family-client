import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

import {UploadPhotoService} from "../../services/upload-photo.service";
import {GalleryState} from "../../store/reducer";
import {receivePhotos} from "../../store/action";
import {photosSelector} from "../../store/selectors";
import {Photo} from "../../models/photo";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit, OnDestroy {

  // image!: SafeUrl;
  image!: any;
  // private readonly photosSubject = new BehaviorSubject<Photo[] | undefined>(undefined);
  // public readonly photos$ = this.photosSubject.asObservable();

  photos$!: Observable<Photo[] | undefined>


  loaded$ = new BehaviorSubject(false);

  private sub = new Subscription();

  constructor(
    private uploadPhotoService: UploadPhotoService,
    private store: Store<GalleryState>,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {

    this.sub.add(this.store.pipe(
      select(photosSelector)
    ).subscribe((p: Photo[] | undefined) => {
      console.log('TEST!!!!_______________PHOTOS_______________', p);
    }));

    // this.http.get(`${environment.apiUrl}/upload-photo/photos/6403643ce6ebaa85b246723f`,
    //   { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
    //
    //   const blob = new Blob([data], { type: 'image/png' });
    //   const reader = new FileReader();
    //   const _this = this;
    //   reader.onload = function (e) {
    //     if (e.target) {
    //       _this.image = e.target.result;
    //       _this.cdr.detectChanges()
    //     }
    //   };
    //   reader.readAsDataURL(blob)
    // });

    this.photos$ = this.store.pipe(
      select(photosSelector)
    )

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPhotosByChapter(chapter: string): void {
    // WITHOUT { relativeTo: this.route } broke
    this.router.navigate([chapter], { relativeTo: this.route });
  }

}
