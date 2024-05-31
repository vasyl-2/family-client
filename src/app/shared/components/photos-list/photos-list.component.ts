import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {map, shareReplay, withLatestFrom} from "rxjs/operators";

import {GalleryState} from "../../../store/reducer";
import {editPhoto, receivePhotos} from "../../../store/action";
import {chaptersHierarchySelector, photosSelector} from "../../../store/selectors";
import {Photo} from "../../../models/photo";
import {environment} from "../../../../environments/environment";
import {Chapter} from "../../../models/chapter";
import {MatDialog} from "@angular/material/dialog";
import {FullSizePhotoComponent} from "../full-size-photo/full-size-photo.component";

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('gallery', { static: false, read: ElementRef }) gallery!: ElementRef;
  photos$!: Observable<Photo[] | undefined>;
  subLevels = 'Подразделы';

  private stateOfChapters: Chapter | undefined;

  previousId: string | undefined;

  private readonly loadedImagesCountSubject = new BehaviorSubject(0);

  subChapter$!: Observable<Chapter>;

  private readonly computeGridStyleSubject = new BehaviorSubject<{ rowHeight: number; rowGap: number } | undefined>(undefined);
  computeGridStyle$ = this.computeGridStyleSubject.asObservable();

  private readonly selectedIdSubject = new BehaviorSubject<string>('');
  private readonly selectedId$ = this.selectedIdSubject.asObservable().pipe(shareReplay(1));

  private readonly previousIdSubject = new BehaviorSubject<string | undefined>('');
  private previousId$ = this.previousIdSubject.asObservable();

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<GalleryState>,
    private dialog: MatDialog,
  ) {
  }

  ngAfterViewInit(): void {
    this.loadedImagesCountSubject.pipe(withLatestFrom(this.photos$))
      .subscribe(([count, photos]: [number, Photo[] | undefined]) => {
        if (photos && (count === photos?.length)) {
          this.setGalleryProps();
        }
    })
  }

  setGalleryProps(): void {
    const computedStyles = window.getComputedStyle(this.gallery.nativeElement);
    const rowHeight = parseInt(computedStyles.getPropertyValue('grid-auto-rows'));
    console.log('ROW___HEIGHT_____', rowHeight)
    const rowGap = parseInt(computedStyles.getPropertyValue('grid-row-gap'));
    this.computeGridStyleSubject.next({ rowGap, rowHeight });
  }

  onImageLoad() {
    const loadedCount = this.loadedImagesCountSubject.value + 1;

    this.loadedImagesCountSubject.next(loadedCount);
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.photos$ = this.store.pipe(select(photosSelector));

    this.subChapter$ = this.selectedId$.pipe(
      withLatestFrom(this.store.pipe(select(chaptersHierarchySelector))),
      map(([id, chapters]: [string, Chapter[]]) => {
        const chapter = this.findChapterByIdInArray(chapters, id);

        if (chapter) {
          return chapter;
        } else {
          return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!;
        }

      }),
    );

    this.subChapter$.subscribe(cH => this.stateOfChapters = cH);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openFullSize(event: MouseEvent, photo: Photo): void {
    event.stopPropagation();

   this.dialog.open(FullSizePhotoComponent, {
        data: photo,
        panelClass: 'full-size-photo'
      }
    )
  }

  onPhotoUpdate(photo: Partial<Photo>): void {
    this.store.dispatch(editPhoto({ photo }));
  }

  getAsset(photo: Photo): string {
    const { fullPath, name } = photo;
    let path =  fullPath ? `${fullPath}/${name}` : name;
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
        const parentOfChapterToGo = this.findChapterById(this.stateOfChapters, chapterToGoBack)?.parent;
        console.log('PARENT___CHAPTER________________________________', parentOfChapterToGo);

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
  }

  private findChapterById(rootChapter: Chapter, targetChapterId: string): Chapter | null {
    // Check if the current chapter is the one we are looking for
    if (rootChapter._id === targetChapterId) {
      return rootChapter;
    }

    // Recursively search through the children
    if (rootChapter.children && rootChapter.children.length > 0) {
      for (const child of rootChapter.children) {
        const foundChapter = this.findChapterById(child, targetChapterId);
        if (foundChapter) {
          return foundChapter; // Return the first match found in the recursion
        }
      }
    }

    // If the target chapter is not found in the current branch, return null
    return null;
  }

  private findChapterByIdInArray(chapters: Chapter[], targetChapterId: string): Chapter | null {
    for (const rootChapter of chapters) {
      const foundChapter = this.findChapterById(rootChapter, targetChapterId);
      if (foundChapter) {
        return foundChapter; // Return the first match found in the array
      }
    }

    // If the target chapter is not found in any branch, return null
    return null;
  }


  private subscribeToRoute(): void {
    this.selectedIdSubject.next(this.route.snapshot.params['chapter']);
    this.store.dispatch(receivePhotos({ chapter: this.route.snapshot.params['chapter'] }));


    // route is autoSubscribed
    // TODO remove manually handling sub

    // this.sub.add(
    //   this.route.paramMap.subscribe((p: ParamMap) => {
    //     this.store.dispatch(receivePhotos({ chapter: p.get('chapter')! }));
    //   })
    // )
  }

}
