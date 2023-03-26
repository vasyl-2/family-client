import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {filter, tap} from "rxjs/operators";
import {Subscription} from "rxjs";

import {CreatePhotoComponent} from "../../shared/components/create-photo/create-photo.component";
import {GalleryState} from "../../store/reducer";
import {Chapter} from "../../models/chapter";
import {createdChapter, createPhoto} from "../../store/action";

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderTopComponent implements OnInit, OnDestroy {

  private sub = new Subscription();

  constructor(
    private dialog: MatDialog,
    private store: Store<GalleryState>
  ) { }

  ngOnInit(): void {
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
          filter((photo) => !!photo),
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
