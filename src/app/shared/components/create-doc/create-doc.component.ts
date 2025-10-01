import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";

import {GalleryState} from "../../../store/reducer";
import {chaptersHierarchySelector} from "../../../store/selectors";
import {withLatestFrom} from "rxjs/operators";
import {Chapter} from "../../../models/chapter";
import {PhotoMedia} from "../../../models/photo";


@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrl: './create-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CreateDocComponent implements OnInit, OnDestroy {

  addMediaForm!: FormGroup;
  mediaChapters$!: Observable<Chapter[]>;
  today!: Date;

  private readonly sub = new Subscription();
  private readonly fileSubject = new BehaviorSubject<File | undefined>(
    undefined,
  );

  get chapterControl(): FormControl {
    return this.addMediaForm!.get('chapter') as FormControl;
  }

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ gallery: GalleryState }>,
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.today = new Date(new Date().getTime());

    this.mediaChapters$ = this.store.pipe(select(chaptersHierarchySelector));

    this.sub.add(
      this.chapterControl.valueChanges
        .pipe(withLatestFrom(this.mediaChapters$))
        .subscribe(([chapter, allChapters]: [string, Chapter[]]) => {
          const currentChapter = this.findChapterById(allChapters, chapter);
          let fullPath: string;

          if (currentChapter && currentChapter.fullPath) {
            fullPath = currentChapter.fullPath;
            this.addMediaForm.get('fullPath')?.setValue(fullPath);
          }

        }),
    );
  }

  // tslint:disable-next-line:no-any
  async uploadMedia(event: any): Promise<void> {
    const file: File = event.target.files[0];
    this.fileSubject.next(file);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addMedia(): void {
    const {
      name = undefined,
      chapter = undefined,
      description = undefined,
      fullPath,
      dateOfMedia = undefined,
    } = this.addMediaForm.value;

    if (this.fileSubject.value == undefined) {
      return;
    } else {
      const media: PhotoMedia = {
        name,
        chapter,
        description,
        media: this.fileSubject.value,
        fullPath,
        date: dateOfMedia,
        type: 'pdf'
      };
      this.dialogRef.close(media);
    }
  }

  private initForm(): void {
    this.addMediaForm = this.fromBuilder.group({
      name: ['', Validators.required],
      chapter: '',
      description: '',
      fullPath: '',
      dateOfMedia: '',
    });
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
