import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  distinctUntilChanged, filter,
  map,
  shareReplay,
  withLatestFrom,
} from 'rxjs/operators';

import { GalleryState } from '../../../store/reducer';
import { editPhoto, receivePhotos } from '../../../store/action';
import {
  chaptersHierarchySelector,
  photosSelector,
} from '../../../store/selectors';
import { Photo } from '../../../models/photo';
import { environment } from '../../../../environments/environment';
import { Chapter } from '../../../models/chapter';
import { MatDialog } from '@angular/material/dialog';
import { FullSizePhotoComponent } from '../full-size-photo/full-size-photo.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HighlightChapterService } from '../../../services/highlight-chapter.service';

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gallery', { static: false, read: ElementRef })
  gallery!: ElementRef;
  photos$!: Observable<Photo[] | undefined>;
  subLevels = 'Подразделы';

  selectChapter!: FormGroup;
  search: FormControl = new FormControl<string>('');
  size: FormControl = new FormControl<number>(1);

  private stateOfChapters: Chapter | undefined;

  previousId: string | undefined;

  private readonly loadedImagesCountSubject = new BehaviorSubject(0);

  subChapter$!: Observable<Chapter>;

  allChapters$!: Observable<Chapter[]>;

  private readonly computeGridStyleSubject = new BehaviorSubject<
    { rowHeight: number; rowGap: number } | undefined
  >(undefined);
  computeGridStyle$ = this.computeGridStyleSubject.asObservable();

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

  private sub = new Subscription();

  private stepToGridColumns = new Map<number, number>();

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
  }

  setGalleryProps(): void {
    const computedStyles = window.getComputedStyle(this.gallery.nativeElement);
    const rowHeight = parseInt(
      computedStyles.getPropertyValue('grid-auto-rows'),
    );
    const rowGap = parseInt(computedStyles.getPropertyValue('grid-row-gap'));
    this.computeGridStyleSubject.next({ rowGap, rowHeight });
  }

  onImageLoad() {
    const loadedCount = this.loadedImagesCountSubject.value + 1;

    this.loadedImagesCountSubject.next(loadedCount);
  }

  ngOnInit(): void {
    this.allChapters$ = this.store
      .pipe(select(chaptersHierarchySelector))
      .pipe(
        map((chapters: Chapter[]) => {
          console.log('CURRENT____', chapters, this.route.snapshot.params['chapter']);
          const related = chapters.filter((c: Chapter) => c._id === this.route.snapshot.params['chapter']);
          return related;
        }),
        shareReplay(1)
      );

    this.initForm();
    this.subscribeToChapterChanges();
    this.subscribeToSizeChange();
    this.subscribeToRoute();

    this.photos$ = this.store.pipe(select(photosSelector));

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
      console.log('SUB___CHAPTERS_____', cH)
      this.stateOfChapters = cH;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

  getAsset(photo: Photo): string {
    const { fullPath, name } = photo;
    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiUrl}/${path}`;

    return path;
  }

  selectSubChapter(subChapterId: string): void {
    this.previousIdSubject.next(this.selectedIdSubject.value);
    this.selectedIdSubject.next(subChapterId);
    this.store.dispatch(receivePhotos({ chapter: subChapterId }));
    setTimeout(() => this.setGalleryProps.bind(this), 5000);
  }

  goBackOld() {
    let chapterToGoBack: string | undefined;

    if (this.previousIdSubject.value) {
      chapterToGoBack = this.previousIdSubject.value;
      if (this.stateOfChapters) {
        const parentOfChapterToGo = this.findChapterById(
          this.stateOfChapters,
          chapterToGoBack,
        )?.parent;
        if (parentOfChapterToGo) {
          this.previousIdSubject.next(parentOfChapterToGo);
        }
      }
    } else {
      chapterToGoBack = this.route.snapshot.params['chapter'];
    }

    if (chapterToGoBack) {
      this.selectedIdSubject.next(chapterToGoBack);
      this.store.dispatch(receivePhotos({ chapter: chapterToGoBack }));
    }

    setTimeout(() => this.setGalleryProps.bind(this), 5000);
  }

  goBack(id: string | null | undefined) {
    if (id) {
      this.selectSubChapter(id);
    }
    this.selectChapter.get('chapter')?.setValue(id);
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
          this.selectedIdSubject.next(form.chapter);
          this.store.dispatch(receivePhotos({ chapter: form.chapter }));
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
}
