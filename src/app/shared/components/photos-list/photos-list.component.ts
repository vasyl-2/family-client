import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  skip,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { GalleryState } from '../../../store/reducer';
import {
  editPhoto,
  receivePhotos,
  receiveVideos,
  editVideo,
} from '../../../store/action';
import {
  chaptersHierarchySelector,
  photosSelector,
  videosSelector,
} from '../../../store/selectors';
import { Photo } from '../../../models/photo';
import { environment } from '../../../../environments/environment';
import { Chapter } from '../../../models/chapter';
import { MatDialog } from '@angular/material/dialog';
import { FullSizePhotoComponent } from '../full-size-photo/full-size-photo.component';

import { HighlightChapterService } from '../../../services/highlight-chapter.service';
import { Video } from '../../../models/video';
import {ViewSettingsStore} from "./view-list-store/view-list-store";

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  standalone: false,
  providers: [ViewSettingsStore]
})
export class PhotosListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gallery', { static: false, read: ElementRef })
  gallery!: ElementRef;
  photos$!: Observable<Photo[] | undefined>;
  videos$!: Observable<Video[] | undefined>;

  commonList$!: Observable<(Photo | Video)[]>;

  selectChapter!: FormGroup;
  search: FormControl = new FormControl<string>('');
  size: FormControl = new FormControl<number>(1);

  private stateOfChapters: Chapter | undefined;

  previousId: string | undefined;

  private readonly loadedImagesCountSubject = new BehaviorSubject(0);
  private readonly loadedVideosCountSubject = new BehaviorSubject(0);

  subChapter$!: Observable<Chapter>;

  allChapters$!: Observable<Chapter[]>;

  private readonly computeGridStyleSubject = new BehaviorSubject<
    { rowHeight: number; rowGap: number } | undefined
  >(undefined);
  readonly computeGridStyle$ = this.computeGridStyleSubject.asObservable();

  private readonly sizeOfScaleSubject = new BehaviorSubject<{
    curr: number;
    prev: number | undefined;
    step: number;
  }>({ curr: 1, prev: undefined, step: 1 });
  readonly sizeOfScale$ = this.sizeOfScaleSubject.asObservable();

  private readonly selectedIdSubject = new BehaviorSubject<string>('');
  private readonly selectedId$ = this.selectedIdSubject
    .asObservable()
    .pipe(shareReplay(1));

  private readonly previousIdSubject = new BehaviorSubject<string | undefined>(
    '',
  );

  private readonly gridColumnsValuesSubject = new BehaviorSubject<
    { init: number; second?: number; third?: number } | undefined
  >(undefined);

  private readonly sub = new Subscription();

  private stepToGridColumns = new Map<number, number>();

  private readonly openSubject = new BehaviorSubject(false);
  readonly open$ = this.openSubject.asObservable();

  private readonly showSideBarSubject = new BehaviorSubject<'open' | 'close'>('open');
  readonly showSideBar$ = this.showSideBarSubject.asObservable();

  private readonly showMediaSubject = new BehaviorSubject<'all' | 'video' | 'photo'>('all');
  readonly showMediaType$ = this.showMediaSubject.asObservable();

  private readonly sortBySubject = new BehaviorSubject<'desc' | 'asc' | 'random'>('desc');
  readonly sortBy$ = this.sortBySubject.asObservable();

  private readonly viewSubject = new BehaviorSubject<'table' | 'little' | 'big'>('big');
  readonly view$ = this.viewSubject.asObservable();

  private readonly viewSettingsStore = inject(ViewSettingsStore);

  constructor(
    private route: ActivatedRoute,
    private store: Store<GalleryState>,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private highlightChapterService: HighlightChapterService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.loadedImagesCountSubject
      .pipe(withLatestFrom(this.photos$))
      .subscribe(([count, photos]: [number, Photo[] | undefined]) => {
        if (photos && count === photos?.length) {
          this.setGalleryProps();
        }
      });

    this.loadedVideosCountSubject
      .pipe(withLatestFrom(this.videos$))
      .subscribe(([count, videos]: [number, Video[] | undefined]) => {
        if (videos && count === videos?.length) {
          this.setGalleryProps();
        }
      });
  }

  toggleSideBar(state: 'open' | 'close'): void {
    if (state === 'open') {
      this.showSideBarSubject.next('close');
    } else {
      this.showSideBarSubject.next('open');
    }
  }

  getAsset(media: Photo | Video): string {
    const { fullPath, name } = media;
    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiStaticUrl}/${path}`;
    return path;
  }

  setGalleryProps(): void {
    const computedStyles = window.getComputedStyle(this.gallery.nativeElement);
    const rowHeight = parseInt(
      computedStyles.getPropertyValue('grid-auto-rows'),
    );
    const rowGap = parseInt(computedStyles.getPropertyValue('grid-row-gap'));
    this.computeGridStyleSubject.next({ rowGap, rowHeight });
  }

  onImageLoaded(): void {
    const loadedCount = this.loadedImagesCountSubject.value + 1;
    this.loadedImagesCountSubject.next(loadedCount);
  }

  updateSortOrder(order: 'asc' | 'desc'): void {
    this.viewSettingsStore.updateOrder(order);
  }

  updateParamSortBy(paramSortBy: 'date' | 'name'): void {
    this.viewSettingsStore.updateParamSortBy(paramSortBy);
  }

  onVideoLoaded(e: any): void {
    const loadedCount = this.loadedVideosCountSubject.value + 1;
    this.loadedVideosCountSubject.next(loadedCount);
  }

  ngOnInit(): void {
    this.allChapters$ = this.store.pipe(select(chaptersHierarchySelector)).pipe(
      tap((cHs: Chapter[]) => {
        // if (cHs.length) {
        //   this.selectedIdSubject.next(cHs[0]._id!);
        //   this.store.dispatch(
        //     receivePhotos({ chapter: cHs[0]._id! }),
        //   );
        // }
      }),
      map((chapters: Chapter[]) => {
        // console.log('CURRENT____', chapters, this.route.snapshot.params['chapter']);
        // const related = chapters.filter((c: Chapter) => c._id === this.route.snapshot.params['chapter']);
        // return related;
        return chapters;
      }),
      shareReplay(1),
    );

    this.initForm();
    this.subscribeToChapterChanges();
    this.subscribeToSizeChange();
    // this.subscribeToRoute();

    this.photos$ = this.store.pipe(select(photosSelector));
    this.videos$ = this.store.pipe(select(videosSelector));

    this.subChapter$ = this.selectedId$.pipe(
      withLatestFrom(this.allChapters$),
      map(([id, chapters]: [string, Chapter[]]) => {
        const chapter = this.findChapterByIdInArray(chapters, id);

        if (chapter) {
          return chapter;
        } else {
          return chapters.find(
            (c: Chapter) => c._id === this.route.snapshot.params['chapter'],
          )!;
        }
      }),
    );

    this.subChapter$.subscribe((cH: Chapter) => {
      console.log('SUB___CHAPTERS_____', cH);
      this.stateOfChapters = cH;
    });

    this.commonList$ = combineLatest([
      this.photos$.pipe(
        map((photos: Photo[] | undefined) => {
          if (photos && photos.length) {
            return photos.map((photo: Photo) => {
              const newPhoto = { ...photo };
              newPhoto.type = 'photo';
              return newPhoto;
            });
          }
          return photos;
        }),
      ),
      this.videos$.pipe(
        map((videos: Video[] | undefined) => {
          if (videos && videos.length) {
            return videos.map((video: Video) => {
              const newVideo = { ...video };
              newVideo.type = 'video';
              return newVideo;
            });
          }
          return videos;
        }),
      ),
      this.sortBy$
    ]).pipe(
      map(([photos, videos, order]) => {
        switch (order) {
          case 'desc':
            return [...(photos ?? []), ...(videos ?? [])].sort((a, b) => {
              const aTime = a.date ? new Date(a.date).getTime() : 0;
              const bTime = b.date ? new Date(b.date).getTime() : 0;
              return bTime - aTime;
            });
          case 'asc':
            return [...(photos ?? []), ...(videos ?? [])].sort((a, b) => {
              const aTime = a.date ? new Date(a.date).getTime() : 0;
              const bTime = b.date ? new Date(b.date).getTime() : 0;
              return aTime - bTime;
            });
          case 'random':
            return [...(photos ?? []), ...(videos ?? [])];
          default:
            return [...(photos ?? []), ...(videos ?? [])];
        }
      }),
    );

    this.subscribeToToggleSideBar();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onOrderChanged(e: 'asc' | 'desc' | 'random'):void {
    this.sortBySubject.next(e);
  }

  onViewChanged(e: 'table' | 'little' | 'big'): void {
    this.viewSubject.next(e);
  }

  openFullSize(event: MouseEvent, photo: Photo): void {
    event.stopPropagation();

    this.dialog.open(FullSizePhotoComponent, {
      data: photo,
      panelClass: 'full-size-photo',
    });
  }

  onPhotoUpdate(photo: Partial<Photo>): void {
    this.store.dispatch(editPhoto({ photo }));
  }

  onVideoUpdate(video: Partial<Video>): void {
    this.store.dispatch(editVideo({ video }));
  }

  // getAsset(photo: Photo): string {
  //   const { fullPath, name } = photo;
  //   let path = fullPath ? `${fullPath}/${name}` : name;
  //   path = `${environment.apiUrl}/${path}`;
  //
  //   return path;
  // }

  selectSubChapter(subChapterId: string): void {
    this.previousIdSubject.next(this.selectedIdSubject.value);
    this.selectedIdSubject.next(subChapterId);
    this.store.dispatch(receivePhotos({ chapter: subChapterId }));
    this.store.dispatch(receiveVideos({ chapter: subChapterId }));
    setTimeout(() => this.setGalleryProps.bind(this), 5000);
  }

  // goBackOld() {
  //   let chapterToGoBack: string | undefined;
  //
  //   if (this.previousIdSubject.value) {
  //     chapterToGoBack = this.previousIdSubject.value;
  //     if (this.stateOfChapters) {
  //       const parentOfChapterToGo = this.findChapterById(
  //         this.stateOfChapters,
  //         chapterToGoBack,
  //       )?.parent;
  //       if (parentOfChapterToGo) {
  //         this.previousIdSubject.next(parentOfChapterToGo);
  //       }
  //     }
  //   } else {
  //     chapterToGoBack = this.route.snapshot.params['chapter'];
  //   }
  //
  //   if (chapterToGoBack) {
  //     this.selectedIdSubject.next(chapterToGoBack);
  //     this.store.dispatch(receivePhotos({ chapter: chapterToGoBack }));
  //   }
  //
  //   setTimeout(() => this.setGalleryProps.bind(this), 5000);
  // }

  goBack(id: string | null | undefined) {
    if (id) {
      this.selectSubChapter(id);
    }
    this.selectChapter.get('chapter')?.setValue(id);
  }

  showMedia(media: 'photo' | 'video' | 'all') {
    this.loadedImagesCountSubject.next(0);
    this.loadedVideosCountSubject.next(0);
    this.showMediaSubject.next(media);
  }

  private findChapterById(
    rootChapter: Chapter,
    targetChapterId: string,
  ): Chapter | null {
    if (rootChapter._id === targetChapterId) {
      return rootChapter;
    }

    if (rootChapter.children && rootChapter.children.length > 0) {
      for (const child of rootChapter.children) {
        const foundChapter = this.findChapterById(child, targetChapterId);
        if (foundChapter) {
          return foundChapter; // Return the first match found in the recursion
        }
      }
    }

    return null;
  }

  private findChapterByIdInArray(
    chapters: Chapter[],
    targetChapterId: string,
  ): Chapter | null {
    for (const rootChapter of chapters) {
      const foundChapter = this.findChapterById(rootChapter, targetChapterId);
      if (foundChapter) {
        return foundChapter; // Return the first match found in the array
      }
    }
    return null;
  }

  private subscribeToRoute(): void {
    this.selectedIdSubject.next(this.route.snapshot.params['chapter']);
    this.store.dispatch(
      receivePhotos({ chapter: this.route.snapshot.params['chapter'] }),
    );

    // route is autoSubscribed
    // TODO remove manually handling sub

    // this.sub.add(
    //   this.route.paramMap.subscribe((p: ParamMap) => {
    //     this.store.dispatch(receivePhotos({ chapter: p.get('chapter')! }));
    //   })
    // )
  }

  private initForm(): void {
    this.selectChapter = this.formBuilder.group({
      chapter: [''],
    });
  }

  private subscribeToChapterChanges(): void {
    this.selectChapter.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((form) => {
        if (form.chapter) {
          this.loadedImagesCountSubject.next(0);
          this.loadedVideosCountSubject.next(0);
          console.log('CHAPTER____', form.chapter)
          this.selectedIdSubject.next(form.chapter);
          this.store.dispatch(receivePhotos({ chapter: form.chapter }));
          this.store.dispatch(receiveVideos({ chapter: form.chapter }));
          this.highlightChapterService.chapterIdSubject.next(form.chapter);
        }
      });
  }

  private subscribeToSizeChange(): void {
    this.size.valueChanges.subscribe((size: string) => {
      const numberSize = +size;

      console.log('NUMBER_SIZE_____', numberSize);
      let { curr, prev, step } = this.sizeOfScaleSubject.value;
      const computedStyle = window.getComputedStyle(this.gallery.nativeElement);
      const isMore =
        !prev || this.sizeOfScaleSubject.value.curr - numberSize < 0;
      const currentGridColumns = parseInt(
        computedStyle.getPropertyValue('grid-template-columns'),
        10,
      );

      if (!this.stepToGridColumns.has(step)) {
        this.stepToGridColumns.set(step, currentGridColumns);
      }

      let newGridTemplateColumns: number;
      console.log('COLUMNS_____________', currentGridColumns);

      let multiPly: number;

      if (isMore && !this.stepToGridColumns.has(numberSize)) {
        if (!prev) {
          if (numberSize === 3) {
            multiPly = 4;
          } else {
            multiPly = 2;
          }
        } else {
          if (Math.abs(numberSize - step) > 1) {
            multiPly = 4;
          } else {
            multiPly = 2;
          }
        }

        newGridTemplateColumns = currentGridColumns * multiPly;
      } else {
        if (!this.stepToGridColumns.has(numberSize)) {
          console.log('LESS_________________', numberSize);
          const divider = Math.abs(numberSize - step) > 1 ? 4 : 2.3;
          console.log('DIVIDER_________', divider);
          newGridTemplateColumns = currentGridColumns / divider;
          console.log(
            'newGridTemplateColumns_________',
            newGridTemplateColumns,
          );
        } else {
          newGridTemplateColumns = this.stepToGridColumns.get(numberSize)!;
        }
      }

      if (!prev) {
        // increase 100%
        this.gridColumnsValuesSubject.next({
          init: currentGridColumns,
          second: newGridTemplateColumns,
        });
      }

      this.renderer.setStyle(
        this.gallery.nativeElement,
        'gridTemplateColumns',
        `repeat(auto-fill, minmax(${newGridTemplateColumns}px, 1fr))`,
      );

      this.sizeOfScaleSubject.next({
        curr: numberSize,
        prev: curr,
        step: numberSize,
      });
    });
  }

  private subscribeToToggleSideBar(): void {
    this.showSideBar$.pipe(skip(1)).subscribe((state: 'open' | 'close') => {
      this.openSubject.next(!this.openSubject.value);
    });
  }
}
