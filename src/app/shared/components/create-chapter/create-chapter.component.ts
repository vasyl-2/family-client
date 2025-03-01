import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import { Chapter } from '../../../models/chapter';
import { GalleryState } from '../../../store/reducer';
import {
  chaptersHierarchySelector,
  videoChaptersHierarchySelector,
} from '../../../store/selectors';
import { CreateChapter } from '../../../models/dto/create-chapter';

@Component({
    selector: 'app-create-chapter',
    templateUrl: './create-chapter.component.html',
    styleUrls: ['./create-chapter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CreateChapterComponent {
  addChapterForm!: FormGroup;

  photoChapters$!: Observable<Chapter[]>;

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: 'photo' | 'video',
    private store: Store<{ gallery: GalleryState }>,
  ) {}

  ngOnInit() {
    this.initForm();

    const selector =
      this.data === 'photo'
        ? chaptersHierarchySelector
        : videoChaptersHierarchySelector;
    this.photoChapters$ = this.store.pipe(select(selector));
  }

  addChapter(): void {
    const {
      name = undefined,
      parentChapter = undefined,
      latinname = undefined,
    } = this.addChapterForm.value;
    const chapter: CreateChapter = {
      title: latinname,
      nameForUI: name,
      parent: parentChapter,
    };
    this.dialogRef.close(chapter);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.addChapterForm = this.fromBuilder.group({
      name: ['', Validators.required],
      latinname: ['', Validators.required],
      parentChapter: '',
      description: ''
    });
  }
}
