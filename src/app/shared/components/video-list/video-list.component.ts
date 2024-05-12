import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Video} from "../../../models/video";
import {Chapter} from "../../../models/chapter";
import {map, shareReplay, withLatestFrom} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {GalleryState} from "../../../store/reducer";
import {MatDialog} from "@angular/material/dialog";
import {Photo} from "../../../models/photo";
import {receivePhotos, receiveVideos} from "../../../store/action";
import {chaptersHierarchySelector, photosSelector, videosSelector} from "../../../store/selectors";

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gallery', { static: false, read: ElementRef }) gallery!: ElementRef;
  videos$!: Observable<Video[] | undefined> ;
  subLevels = 'Подразделы';

  private readonly loadedVideosCountSubject = new BehaviorSubject(0);

  subChapter$!: Observable<Chapter>;

  private readonly computeGridStyleSubject = new BehaviorSubject<{ rowHeight: number; rowGap: number } | undefined>(undefined);
  computeGridStyle$ = this.computeGridStyleSubject.asObservable();

  private readonly selectedIdSubject = new BehaviorSubject<string | undefined>('');
  private readonly selectedId$ = this.selectedIdSubject.asObservable().pipe(shareReplay(1));

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<GalleryState>,
    private dialog: MatDialog,
  ) {
  }

  ngAfterViewInit(): void {
    this.loadedVideosCountSubject.pipe(withLatestFrom(this.videos$))
      .subscribe(([count, photos]: [number, Photo[] | undefined]) => {
        if (photos && (count === photos?.length)) {
          this.setGalleryProps();
        }
      })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.videos$ = this.store.pipe(select(videosSelector));

    this.videos$.subscribe(x => {
      console.log('VIDEOS________ALL__________!!!!', x)
    });

    this.subChapter$ = this.selectedId$.pipe(
      withLatestFrom(this.store.pipe(select(chaptersHierarchySelector))),
      map(([id, chapters]: [string | undefined, Chapter[]]) => {
        if (!!id) {
          // const chapter = chapters.find((c: Chapter) => c.children?.find((c: Chapter) => c._id === id))!
          const chapter = this.findChapterByIdInArray(chapters, id);

          if (chapter) {
            console.log('YES___________________________', chapter)
            return chapter;
          } else {
            return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
          }


          // if (chapter && chapter.children) {
          //   return chapter.children.find((c: Chapter) => c._id === id)!;
          // } else {
          //   this.store.dispatch(receivePhotos({ chapter: this.route.snapshot.params['chapter'] }));
          //   return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
          // }
        } else {
          return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
        }
      }),
    );

  }

  onImageLoad() {
    const loadedCount = this.loadedVideosCountSubject.value + 1;

    this.loadedVideosCountSubject.next(loadedCount);
  }

  setGalleryProps(): void {
    const computedStyles = window.getComputedStyle(this.gallery.nativeElement);
    const rowHeight = parseInt(computedStyles.getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(computedStyles.getPropertyValue('grid-row-gap'));
    this.computeGridStyleSubject.next({ rowGap, rowHeight });
  }

  private subscribeToRoute(): void {
    console.log('ROUTE__PARAM____________', this.route.snapshot.params['chapter']);
    this.store.dispatch(receiveVideos({ chapter: this.route.snapshot.params['chapter'] }));


    // route is autoSubscribed
    // TODO remove manually handling sub

    // this.sub.add(
    //   this.route.paramMap.subscribe((p: ParamMap) => {
    //     this.store.dispatch(receivePhotos({ chapter: p.get('chapter')! }));
    //   })
    // )
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

  selectSubChapter(subChapterId: string): void {
    this.selectedIdSubject.next(subChapterId);
    this.store.dispatch(receivePhotos({ chapter: subChapterId }));
  }

}
