import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

import {CreatePhotoComponent} from "../../shared/components/create-photo/create-photo.component";
import {GalleryState} from "../../store/reducer";
import {Chapter} from "../../models/chapter";
import {
  authenticateAlert,
  authenticateAlertHide,
  authenticated,
  createChapter,
  createdChapter,
  createPhoto, createVideo, createVideoChapter,
  logout
} from "../../store/action";
import {Photo} from "../../models/photo";
import {
  alertSelector,
  chaptersHierarchySelector,
  chaptersSelector,
  isAuthenticated,
  videoChaptersHierarchySelector, videoChaptersSelector
} from "../../store/selectors";
import {CreateChapterComponent} from "../../shared/components/create-chapter/create-chapter.component";
import {CreateChapter} from "../../models/dto/create-chapter";
import {CreateVideoComponent} from "../../shared/components/create-video/create-video.component";
import {Video} from "../../models/video";

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderTopComponent implements OnInit, OnDestroy {

  imageUrl!: string;

  private readonly isAdminSubject = new BehaviorSubject(false);
  readonly isAdmin$ = this.isAdminSubject.asObservable();

  showAlert$!: Observable<boolean>;

  isAuthenticated$!: Observable<boolean>;

  private sub = new Subscription();

  constructor(
    private dialog: MatDialog,
    private store: Store<GalleryState>,
    private router: Router
  ) { }

  ngOnInit(): void {

    const token = localStorage.getItem('auth');

    if (!!token) {
      const payload = JSON.parse(atob(token.split('.')[1]));


      const isNotExp = Date.now() / 1000 < payload.exp;


      if (isNotExp) {

        const item: { token: string; isAdmin?: boolean } = { token: localStorage.getItem('auth') as string };


        if (payload.email) {
          if (payload.email !== 'dom') {
            console.log('payload_email1', payload.email && payload.email !== 'dom')
            item.isAdmin = true;
          } else {
            item.isAdmin = false;
          }

        } else {
          console.log('payload_email2', payload.email && payload.email !== 'dom')

          item.isAdmin = false;
        }

        this.isAdminSubject.next(item.isAdmin);

        this.store.dispatch(authenticated(item));
        this.store.dispatch(authenticateAlertHide());
      } else {
        localStorage.removeItem('auth');
      }
    } else {
    }

    this.showAlert$ = this.store.pipe(
      select(alertSelector)
    );

    this.isAuthenticated$ = this.store.pipe(
      select(isAuthenticated)
    );

    this.isAuthenticated$
      .pipe(filter(Boolean))
      .subscribe((_) => {
      this.router.navigate(["/"]).then(() => {
        // location.reload();
      });
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addPhoto(): void {
    if (!this.isAdminSubject.value) {
      return;
    }
    const dialogRef = this.dialog.open(CreatePhotoComponent, {
      panelClass: 'dialog-property',
      // position: { top: '80px' },
      data: {},
    });

    this.sub.add(
      dialogRef.afterClosed()
        .pipe(
          filter((photo: Photo) => !!photo),
          switchMap((photo) => this.store.pipe(select(chaptersSelector)).pipe(
            map((chapters: Chapter[]) => {
              const currentChapter = chapters.find((c: Chapter) => c._id === photo.chapter);
              photo.chapterName = currentChapter!!.title;
              return photo;
            })
          ))
        )
        .subscribe((photo) => this.store.dispatch(createPhoto({ payload: photo })))
    )
  }

  addVideo(): void {
    if (!this.isAdminSubject.value) {
      return;
    }
    const dialogRef = this.dialog.open(CreateVideoComponent, {
      panelClass: 'dialog-property',
      // position: { top: '80px' },
      data: {},
    });

    this.sub.add(
      dialogRef.afterClosed()
        .pipe(
          filter((video: Video) => !!video),
          switchMap((video) => this.store.pipe(select(videoChaptersSelector)).pipe(
            map((chapters: Chapter[]) => {
              const currentChapter = chapters.find((c: Chapter) => c._id === video.chapter);
              video.chapterName = currentChapter!!.title;
              return video;
            })
          ))
        )
        .subscribe((video: Video) => {
          this.store.dispatch(createVideo({ payload: video }));
        })
    )
  }

  addChapter(type: 'photo' | 'video' = 'photo'): void {
    if (!this.isAdminSubject.value) {
      return;
    }
    const selector = type === 'photo' ?  chaptersHierarchySelector : videoChaptersHierarchySelector;
    this.sub.add(
      this.dialog.open(CreateChapterComponent, {
        data: type
      }).afterClosed()
        .pipe(
          filter((chapter: CreateChapter | undefined) => !!chapter),
          switchMap((chapter: CreateChapter | undefined) => this.store.pipe(select(selector))
            .pipe(map((chapters: Chapter[]) => {
              const newChapter = { ...chapter };

              let fullPath: string;
              if (newChapter.parent) {
                const parentPath = this.buildFullPath(chapters, newChapter.parent);
                fullPath = `${parentPath}/${newChapter.nameForUI}`
              } else {
                fullPath = newChapter.nameForUI!;
              }

              newChapter.fullPath = fullPath;

              return newChapter;
            }))),
          // switchMap((chapter: CreateChapter | undefined) => this.store.pipe(select(chaptersSelector))
          //   .pipe(map((chapters: Chapter[]) => {
          //     const newChapter = { ...chapter };
          //     const currentChapter = chapters.find((c: Chapter) => c._id === chapter!.parent);
          //     newChapter!.parentTitle = currentChapter!.title;
          //     return newChapter;
          //   }))),
          tap((chapter: CreateChapter | undefined) => console.log('FILLED_CHAPTER___________', chapter))
        )
        .subscribe((chapter: Chapter | undefined) => {
          const action = type === 'photo' ?  createChapter : createVideoChapter;
          chapter && this.store.dispatch(action({ payload: chapter }));
        })
    )
  }

  buildFullPath(list: Chapter[], nearestParentId: string) {
    function findPath(item: Chapter): string | null {
      if (item._id === nearestParentId) {
        return item.title!;
      }

      if (item.children && item.children.length) {
        for (const child of item.children) {
          const pathInChild = findPath(child);
          if (pathInChild) {
            return item.title + '/' + pathInChild;
          }
        }
      }

      return null;
    }

    for (const item of list) {
      const path = findPath(item);
      if (path) {
        return path;
      }
    }

    return null; // Return null if the item with the given id is not found
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.store.dispatch(authenticateAlert());
    this.store.dispatch(logout());
    this.router.navigate(['/auth', 'logout']);
  }
}
