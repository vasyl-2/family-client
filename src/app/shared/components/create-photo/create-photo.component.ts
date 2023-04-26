import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";

import {extensions} from "../../../data/extensions";
import {chapters} from "../../../data/chapters";
import {Photo} from "../../../models/photo";


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
  photoChapters: { title: string, id: string }[] = chapters;

  constructor(
    private fromBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  // tslint:disable-next-line:no-any
  uploadPhoto(event: any): void {
    const file: File = event.target.files[0];

    this.fileSubject.next(file);
  }

  addPhoto(): void {
    const { name = undefined, chapter = undefined } = this.addPhotoForm.value;

    if (! this.fileSubject.value) {
      return;
    }

    const photo: Photo = { name, chapter, photo: this.fileSubject.value };

    this.dialogRef.close(photo);
  }

  private initForm(): void {
    this.addPhotoForm = this.fromBuilder.group({
      name: ['', Validators.required],
      chapter: '',
    })
  }
}
