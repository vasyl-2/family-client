import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import { select, Store } from "@ngrx/store";

import { extensions } from "../../../data/extensions";
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
export class CreatePhotoComponent implements OnInit {

  addPhotoForm!: FormGroup;
  private sub = new Subscription();

  private readonly fileSubject = new BehaviorSubject<File | undefined>(undefined);

  photoExtensions: string[] = extensions;
  photoChapters$!: Observable<Chapter[]>;

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ gallery: GalleryState}>
  ) {
  }

  ngOnInit() {
    this.initForm();

    this.photoChapters$ = this.store.pipe(
      select(chaptersHierarchySelector),
    )
  }
  // tslint:disable-next-line:no-any
  uploadPhoto(event: any): void {
    const file: File = event.target.files[0];

    this.fileSubject.next(file);
  }

  addPhoto(): void {
    const { name = undefined, chapter = undefined, description = undefined } = this.addPhotoForm.value;
    if (!this.fileSubject.value) {
      alert('__________________________________')
      return;
    }
    const photo: Photo = { name, chapter, description, photo: this.fileSubject.value };
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
    })
  }
}
