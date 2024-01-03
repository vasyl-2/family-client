import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";

import {GalleryState} from "../../../store/reducer";
import {extensions} from "../../../data/extensions";
import {Chapter} from "../../../models/chapter";
import {chaptersHierarchySelector} from "../../../store/selectors";
import {withLatestFrom} from "rxjs/operators";
import {Photo} from "../../../models/photo";
import {Video} from "../../../models/video";

@Component({
  selector: 'app-create-video',
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateVideoComponent implements OnInit, OnDestroy {

  addVideoForm!: FormGroup;

  get chapterControl(): FormControl {
    return this.addVideoForm!.get('chapter') as FormControl;
  }

  photoExtensions: string[] = extensions;
  photoChapters$!: Observable<Chapter[]>;

  private sub = new Subscription();

  private readonly fileSubject = new BehaviorSubject<File | undefined>(undefined);


  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ gallery: GalleryState}>
  ) {
  }

  ngOnInit(): void {
    this.initForm();

    this.photoChapters$ = this.store.pipe(
      select(chaptersHierarchySelector),
    );

    this.sub.add(
      this.chapterControl.valueChanges
        .pipe(withLatestFrom(this.photoChapters$))
        .subscribe(([chapter, allChapters]: [string, Chapter[]]) => {
          console.log('CHAPTER___AAAAA__________', allChapters);
          const currentChapter = this.findChapterById(allChapters, chapter);
          let fullPath: string;

          if (currentChapter && currentChapter.fullPath) {
            fullPath = currentChapter.fullPath;
            this.addVideoForm.get('fullPath')?.setValue(fullPath);
          }

          console.log('CURRENT___CHAPTER_____', currentChapter);
        })
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // tslint:disable-next-line:no-any
  uploadVideo(event: any): void {
    console.log('1_________________________')
    const file: File = event.target.files[0];

    this.fileSubject.next(file);
  }

  addVideo(): void {

    const { name = undefined, chapter = undefined, description = undefined, fullPath } = this.addVideoForm.value;
    if (!this.fileSubject.value) {
      alert('__________________________________')
      return;
    }
    const photo: Video = { name, chapter, description, photo: this.fileSubject.value, fullPath };
    this.dialogRef.close(photo);
  }

  cancel(): void {
    this.dialogRef.close();
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

  private initForm(): void {
    this.addVideoForm = this.fromBuilder.group({
      name: ['', Validators.required],
      chapter: '',
      description: '',
      fullPath: '',
    })
  }
}
