import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {filter, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

import {CreatePhotoComponent} from "../../shared/components/create-photo/create-photo.component";
import {GalleryState} from "../../store/reducer";
import {Chapter} from "../../models/chapter";
import {createdChapter, createPhoto} from "../../store/action";
import {Photo} from "../../models/photo";
import {alertSelector, isAuthenticated} from "../../store/selectors";
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
    this.showAlert$ = this.store.pipe(
      select(alertSelector)
    );

    this.isAuthenticated$ = this.store.pipe(
      select(isAuthenticated)
    );

    this.isAuthenticated$.pipe(filter(Boolean)).subscribe((_) => this.router.navigate(["/"]))

    this.showAlert$.subscribe(x => console.log('ALERT___________', x))
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
          tap((photo) => console.log('ADD_PHOTO__________', photo))
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
}
