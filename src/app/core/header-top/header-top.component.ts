import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

import {CreatePhotoComponent} from "../../shared/components/create-photo/create-photo.component";
import {GalleryState} from "../../store/reducer";
import {Chapter} from "../../models/chapter";
import {
  authenticateAlert,
  authenticateAlertHide,
  authenticated,
  createChapter,
  createdChapter,
  createPhoto, createVideo,
  logout
} from "../../store/action";
import {Photo} from "../../models/photo";
import {alertSelector, chaptersHierarchySelector, chaptersSelector, isAuthenticated} from "../../store/selectors";
import {Router} from "@angular/router";
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

      console.log('PAYLOAD_____', payload);

      const isNotExp = Date.now() / 1000 < payload.exp;

      console.log('IS___EXP_____________', isNotExp)

      if (isNotExp) {

        console.log('ITEM IN PLACE, BUT EXPIRED TOKEN!!!!!!!!!!')
        console.log('ITEM___________________________', localStorage.getItem('auth'));
        this.store.dispatch(authenticated({ token: localStorage.getItem('auth') as string}));
        this.store.dispatch(authenticateAlertHide());
      } else {
        console.log('NOT_AUTHORIZED');
        localStorage.removeItem('auth');
      }
    } else {
      console.log('NOT_AUTHORIZED')
    }

    this.showAlert$ = this.store.pipe(
      select(alertSelector)
    );

    this.isAuthenticated$ = this.store.pipe(
      select(isAuthenticated)
    );

    this.showAlert$.subscribe(x => console.log('SHOW__________________________________', x))
    this.isAuthenticated$.pipe(filter(Boolean)).subscribe((_) => {
      console.log('AUTHENTICATED_SUCCESFUL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      this.router.navigate(["/"]).then(() => {
        // location.reload();
      });
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addPhoto(): void {
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
              console.log('CHAPTER____!!1', photo);
              console.log('CHAPTER____!!2', chapters);
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
    const dialogRef = this.dialog.open(CreateVideoComponent, {
      panelClass: 'dialog-property',
      // position: { top: '80px' },
      data: {},
    });

    this.sub.add(
      dialogRef.afterClosed()
        .pipe(
          filter((video: Video) => !!video),
          switchMap((video) => this.store.pipe(select(chaptersSelector)).pipe(
            map((chapters: Chapter[]) => {
              const currentChapter = chapters.find((c: Chapter) => c._id === video.chapter);
              video.chapterName = currentChapter!!.title;
              console.log('currentChapterData____________________', currentChapter)
              return video;
            })
          ))
        )
        .subscribe((video: Video) => {
          console.log('VID_____SEND______', video);
          this.store.dispatch(createVideo({ payload: video }));
        })
    )
  }

  addChapter(): void {
    this.sub.add(
      this.dialog.open(CreateChapterComponent).afterClosed()
        .pipe(
          filter((chapter: CreateChapter | undefined) => !!chapter),
          switchMap((chapter: CreateChapter | undefined) => this.store.pipe(select(chaptersHierarchySelector))
            .pipe(map((chapters: Chapter[]) => {
              const newChapter = { ...chapter };

              let fullPath: string;
              if (newChapter.parent) {
                const parentPath = this.buildFullPath(chapters, newChapter.parent);
                fullPath = `${parentPath}/${newChapter.nameForUI}`
                console.log('FULLL____PATH____________________', fullPath);

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
        .subscribe((chapter: Chapter | undefined) =>
            chapter && this.store.dispatch(createChapter({ payload: chapter }))
          )
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
