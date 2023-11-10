import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

import {CreatePhotoComponent} from "../../shared/components/create-photo/create-photo.component";
import {GalleryState} from "../../store/reducer";
import {Chapter} from "../../models/chapter";
import {authenticateAlert, authenticateAlertHide, authenticated, createdChapter, createPhoto, logout} from "../../store/action";
import {Photo} from "../../models/photo";
import {alertSelector, chaptersSelector, isAuthenticated} from "../../store/selectors";
import {Router} from "@angular/router";

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

    if (!!localStorage.getItem('auth')) {
      console.log('ITEM___________________________', localStorage.getItem('auth'));
      this.store.dispatch(authenticated({ token: localStorage.getItem('auth') as string}));
      this.store.dispatch(authenticateAlertHide());
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
      this.router.navigate(["/"]);
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
          tap((photo) => console.log('ADD_PHOTO__________', photo)),
          switchMap((photo) => this.store.pipe(select(chaptersSelector)).pipe(
            map((chapters: Chapter[]) => {
              const currentChapter = chapters.find((c: Chapter) => c._id === photo.chapter);
              photo.chapterName = currentChapter!!.title;
              console.log('CURRENT__CHAPTER_________', photo);
              return photo;
            })
          ))
        )
        .subscribe((photo) => this.store.dispatch(createPhoto({ payload: photo })))
    )
  }

  addChapter(): void {
    this.sub.add(
      this.dialog.open(CreatePhotoComponent).afterClosed()
        .pipe(
          filter((chapter: Chapter | undefined) => !!chapter),
          tap((chapter: Chapter | undefined) => console.log('FILLED_CHAPTER___________', chapter))
        )
        .subscribe((chapter: Chapter | undefined) =>
            chapter && this.store.dispatch(createdChapter({ chapter }))
          )
    )
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.store.dispatch(authenticateAlert());
    this.store.dispatch(logout());
    this.router.navigate(['/auth', 'logout']);
  }
}
