import {ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Observable} from "rxjs";
import {Chapter} from "../../../models/chapter";
import { select, Store } from "@ngrx/store";

import { GalleryState } from "../../../store/reducer";
import { chaptersSelector } from "../../../store/selectors";

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChapterListComponent implements OnInit {


  @Output() chapterSelected = new EventEmitter<string>();

  photoChapters$!: Observable<Chapter[]>;

  constructor(
    private store: Store<{ gallery: GalleryState}>,
  ) {
  }

  ngOnInit(): void {
    this.photoChapters$ = this.store.pipe(
      select(chaptersSelector),
    );
  }

  selectChapter(chapter: string): void {
    console.log('SELECTED_CHAPTER____', chapter);
    this.chapterSelected.emit(chapter);
  }

}
