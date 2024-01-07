import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BehaviorSubject, combineLatest, Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";

import {GalleryState} from "../../../store/reducer";
import {receivePhotos} from "../../../store/action";
import {chaptersHierarchySelector, photosSelector} from "../../../store/selectors";
import {Photo} from "../../../models/photo";
import {environment} from "../../../../environments/environment";
import {Chapter} from "../../../models/chapter";
import {map, shareReplay, startWith, withLatestFrom} from "rxjs/operators";

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosListComponent implements OnInit, OnDestroy{

  photos$!: Observable<Photo[] | undefined>;

  subChapter$!: Observable<Chapter>;

  private readonly selectedIdSubject = new BehaviorSubject<string | undefined>('');
  private readonly selectedId$ = this.selectedIdSubject.asObservable().pipe(shareReplay(1));

  // chapter$!: Observable<string>;

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store<GalleryState>,
  ) {
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.photos$ = this.store.pipe(select(photosSelector));

    // this.subChapters$ = this.store.pipe(
    //   select(chaptersHierarchySelector),
    //   map((chapters: Chapter[]) => {
    //     return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
    //   }),
    //   shareReplay(1)
    // );


    // this.subChapters$ = combineLatest([
    //   this.store.pipe(select(chaptersHierarchySelector)),
    //   this.selectedId$
    // ]).pipe(
    //   map(([chapters, id]: [Chapter[], string | undefined]) => {
    //     if (id) {
    //       return chapters.find((c: Chapter) => c._id === id)!;
    //     } else {
    //       return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
    //     }
    //   }),
    // );

    this.subChapter$ = this.selectedId$.pipe(
      withLatestFrom(this.store.pipe(select(chaptersHierarchySelector))),
      map(([id, chapters]: [string | undefined, Chapter[]]) => {
        if (!!id) {
          console.log('1_______', id);
          console.log('1_______!!!!!!!', chapters);

          const chapter = chapters.find((c: Chapter) => c.children?.find((c: Chapter) => c._id === id))!

          if (chapter && chapter.children) {
            return chapter.children.find((c: Chapter) => c._id === id)!;
          } else {
            this.store.dispatch(receivePhotos({ chapter: this.route.snapshot.params['chapter'] }));
            return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
          }

        } else {
          console.log('2_______');

          return chapters.find((c: Chapter) => c._id === this.route.snapshot.params['chapter'])!
        }
      }),
    )

    // this.chapter$ = combineLatest([
    //   this.subChapters$,
    //   this.selectedId$
    // ]).pipe(
    //   map(([subChapters, id]: [Chapter, string | undefined]) => {
    //     if (id) {
    //       const chapter = subChapters.children!.find((ch: Chapter) => ch._id === id);
    //       return chapter!.nameForUI!
    //     } else {
    //       if (subChapters._id === this.route.snapshot.params['chapter']) {
    //         return subChapters.nameForUI!;
    //       } else {
    //         const chapter = subChapters.children!.find((ch: Chapter) => ch._id === this.route.snapshot.params['chapter']);
    //         return chapter!.nameForUI!
    //       }
    //     }
    //   })
    // )


    this.subChapter$.subscribe((c) => {
      console.log('SUB___CHAPTERS____________', c);
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getAsset(photo: Photo): string {
    const { fullPath, name } = photo;
    let path =  fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiUrl}/${path}`;

    return path;
  }

  selectSubChapter(subChapterId: string): void {
    this.selectedIdSubject.next(subChapterId);
    this.store.dispatch(receivePhotos({ chapter: subChapterId }));
  }

  private subscribeToRoute(): void {
    console.log('ROUTE__PARAM____________', this.route.snapshot.params['chapter']);
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
