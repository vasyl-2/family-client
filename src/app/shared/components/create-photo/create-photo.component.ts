import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BehaviorSubject, Observable} from "rxjs";

import {extensions} from "../../../data/extensions";
import {chapters} from "../../../data/chapters";
import {Photo} from "../../../models/photo";
import {GalleryState} from "../../../store/reducer";
import {select, Store} from "@ngrx/store";
import {chaptersSelector} from "../../../store/selectors";
import {Chapter} from "../../../models/chapter";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-create-photo',
  templateUrl: './create-photo.component.html',
  styleUrls: ['./create-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePhotoComponent implements OnInit {

  addPhotoForm!: FormGroup;

  private readonly fileSubject = new BehaviorSubject<File | undefined>(undefined);

  photoExtensions: string[] = extensions;
  // photoChapters: { title: string, id: string }[] = chapters;
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
      select(chaptersSelector),
      map((chaptersFromDB: Chapter[]) => chaptersFromDB.map((c: Chapter) => {
        const readableName = chapters.find((ch: Chapter) => ch.id === c.readable_id);

        if (readableName) {
          const newC = { ...c, readableName: readableName.title }
          return newC;
        }

        return c;

      }))
    )
    this.photoChapters$.subscribe(c => console.log('C______________________', c));
  }

  // tslint:disable-next-line:no-any
  uploadPhoto(event: any): void {
    console.log('EVENT_____________', event.target.files);
    const file: File = event.target.files[0];

    this.fileSubject.next(file);
  }

  addPhoto(): void {
    const { name = undefined, chapter = undefined, description = undefined } = this.addPhotoForm.value;

    console.log('CHECK___________', this.fileSubject.value );
    if (!this.fileSubject.value) {
      return;
    }

    const photo: Photo = { name, chapter, description, photo: this.fileSubject.value };

    console.log('CHECK___________1', photo);
    this.dialogRef.close(photo);
  }

  private initForm(): void {
    this.addPhotoForm = this.fromBuilder.group({
      name: ['', Validators.required],
      chapter: '',
      description: '',
    })
  }
}
