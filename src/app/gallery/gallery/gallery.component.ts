import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { UploadPhotoService } from '../../services/upload-photo.service';
import { GalleryState } from '../../store/reducer';
import { receivePhotos } from '../../store/action';
import {
  chaptersHierarchySelector,
  photosSelector,
} from '../../store/selectors';
import { Photo } from '../../models/photo';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Chapter } from '../../models/chapter';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GalleryComponent implements OnInit, OnDestroy {
  // image!: SafeUrl;
  image!: any;
  selectChapter!: FormGroup;
  // private readonly photosSubject = new BehaviorSubject<Photo[] | undefined>(undefined);
  // public readonly photos$ = this.photosSubject.asObservable();

  photos$!: Observable<Photo[] | undefined>;
  photoChapters$!: Observable<Chapter[]>;

  loaded$ = new BehaviorSubject(false);

  private sub = new Subscription();

  constructor(
    private uploadPhotoService: UploadPhotoService,
    private store: Store<GalleryState>,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {}

  get chapterSelectedControl(): FormControl {
    return this.selectChapter.get('chapter') as FormControl;
  }

  ngOnInit() {
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

    this.initForm();
    this.subscribeToChapterChanged();
    this.photos$ = this.store.pipe(select(photosSelector)).pipe();
    this.photoChapters$ = this.store
      .pipe(select(chaptersHierarchySelector))
      .pipe(
        map((chapters: Chapter[]) => {
          console.log(
            'CURRENT____YYYY',
            chapters,
            this.route.snapshot.params['chapter'],
          );
          // const related = chapters.filter((c: Chapter) => c._id === this.route.snapshot.params['chapter']);
          // return related;
          return chapters;
        }),
        shareReplay(1),
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPhotosByChapter(chapter: string): void {
    // WITHOUT { relativeTo: this.route } broke
    this.router.navigate([chapter], { relativeTo: this.route });
  }

  private initForm(): void {
    this.selectChapter = this.formBuilder.group({
      chapter: [''],
    });
  }

  private subscribeToChapterChanged(): void {
    this.chapterSelectedControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((chapter: string) => {
        console.log('VALUE__________', chapter);
      });
  }
}
