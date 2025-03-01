import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {distinctUntilChanged, filter, switchMap, withLatestFrom} from "rxjs/operators";

import {Chapter} from "../../../models/chapter";
import {GalleryState} from "../../../store/reducer";
import {chaptersHierarchySelector} from "../../../store/selectors";
import {MatDialog} from "@angular/material/dialog";
import {EditChapterComponent} from "../edit-chapter/edit-chapter.component";

@Component({
    selector: 'app-edit-chapters',
    templateUrl: './edit-chapters.component.html',
    styleUrls: ['./edit-chapters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EditChaptersComponent implements OnInit{

  photoChapters$!: Observable<Chapter[]>;
  editChapterGroup!: FormGroup;
  editChapters = new FormControl<string>('', { nonNullable: true });
  toEditChapter = new FormControl<boolean>(false,  { nonNullable: true });

  toEditSelectedChapter$!: Observable<boolean>;

  // private selectedChapterToEdit = new BehaviorSubject<string>('');
  // selectedChapterToEdit$ = this.selectedChapterToEdit.asObservable();

  constructor(
    private store: Store<GalleryState>,
    private fromBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.photoChapters$ = this.store.pipe(select(chaptersHierarchySelector));

    this.initForm();
    this.subscribeToChapterSelected();
  }

  getNameOfChapterById(id: string): string {

    return '';
  }

  private subscribeToChapterSelected(): void {
    this.toEditChapter.valueChanges
      .pipe(distinctUntilChanged())
      .pipe(
        filter((toDo: boolean) => toDo),
        withLatestFrom(this.editChapters.valueChanges),
        filter(([toEdit, c]: [boolean, string]) => !!c),
        withLatestFrom(this.photoChapters$),
      )
      .subscribe(([[toEdit, ch], allChapters]: [[boolean, string], Chapter[]]) => {
        console.log('CHAPTER__TO__EDIT____!!!!', ch);
        // this.selectedChapterToEdit.next(ch);
        const chapter = this.findChapterById(allChapters, ch);
        console.log('CHAPTER___TOO_PASS_____!!!,', chapter)
        const dialogRef = this.dialog.open(EditChapterComponent, {
          data: [chapter]
        })
    })
  }

  private initForm(): void {
    this.editChapterGroup = this.fromBuilder.group({});
  }

  private findChapterById(
    chapters: Chapter[],
    targetId: string,
  ): Chapter | undefined {
    for (const chapter of chapters) {
      if (chapter._id === targetId) {
        return chapter;
      }

      if (chapter.children && chapter.children.length > 0) {
        const foundInChildren = this.findChapterById(
          chapter.children,
          targetId,
        );
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }

    return undefined;
  }

}
