import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import { select, Store } from "@ngrx/store";
import {withLatestFrom} from "rxjs/operators";

import { Photo } from "../../../models/photo";
import { GalleryState } from "../../../store/reducer";
import {chaptersHierarchySelector, chaptersSelector} from "../../../store/selectors";
import { Chapter } from "../../../models/chapter";

@Component({
  selector: 'app-create-photo',
  templateUrl: './create-photo.component.html',
  styleUrls: ['./create-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePhotoComponent implements OnInit, OnDestroy {

  addPhotoForm!: FormGroup;
  photoChapters$!: Observable<Chapter[]>;

  private sub = new Subscription();
  private readonly fileSubject = new BehaviorSubject<File | undefined>(undefined);

  get chapterControl(): FormControl {
    return this.addPhotoForm!.get('chapter') as FormControl;
  }

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ gallery: GalleryState}>
  ) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.initForm();

    this.photoChapters$ = this.store.pipe(
      select(chaptersHierarchySelector),
    );

    this.sub.add(
      this.chapterControl.valueChanges
        .pipe(withLatestFrom(this.photoChapters$))
        .subscribe(([chapter, allChapters]: [string, Chapter[]]) => {
        console.log('CHAPTER___SSSS__________', allChapters);
        const currentChapter = this.findChapterById(allChapters, chapter);
        let fullPath: string;

        if (currentChapter && currentChapter.fullPath) {
          fullPath = currentChapter.fullPath;
          this.addPhotoForm.get('fullPath')?.setValue(fullPath);
        }

        console.log('CURRENT___CHAPTER_____', currentChapter);
      })
    )
  }
  // tslint:disable-next-line:no-any
  uploadPhoto(event: any): void {
    const file: File = event.target.files[0];

    this.fileSubject.next(file);
  }

  addPhoto(): void {
    const { name = undefined, chapter = undefined, description = undefined, fullPath } = this.addPhotoForm.value;
    if (!this.fileSubject.value) {
      alert('__________________________________')
      return;
    }
    const photo: Photo = { name, chapter, description, photo: this.fileSubject.value, fullPath };
    this.dialogRef.close(photo);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.addPhotoForm = this.fromBuilder.group({
      name: ['', Validators.required],
      chapter: '',
      description: '',
      fullPath: '',
    })
  }

  private findChapterById(chapters: Chapter[], targetId: string): Chapter | undefined {
    for (const chapter of chapters) {
      if (chapter._id === targetId) {
        return chapter;
      }

      if (chapter.children && chapter.children.length > 0) {
        const foundInChildren = this.findChapterById(chapter.children, targetId);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }

    return undefined;
  }
}
