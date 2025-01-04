import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Chapter } from '../../../models/chapter';
import { select, Store } from '@ngrx/store';

import { GalleryState } from '../../../store/reducer';
import {
  chaptersSelector,
  videoChaptersSelector,
} from '../../../store/selectors';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterListComponent implements OnInit {
  @Input() type: 'photo' | 'video' = 'photo';

  @Output() chapterSelected = new EventEmitter<string>();

  photoChapters$!: Observable<Chapter[]>;

  constructor(private store: Store<{ gallery: GalleryState }>) {}

  ngOnInit(): void {
    const selector =
      this.type === 'photo' ? chaptersSelector : videoChaptersSelector;
    this.photoChapters$ = this.store.pipe(select(selector));

    this.photoChapters$.subscribe((c) =>
      console.log('CHAPTERS_____________________', c),
    );
  }

  selectChapter(chapter: string): void {
    this.chapterSelected.emit(chapter);
  }
}
