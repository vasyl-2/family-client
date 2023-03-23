import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {extensions} from "../../../data/extensions";
import {chapters} from "../../../data/chapters";
import {BehaviorSubject} from "rxjs";
import {DialogRef} from "@angular/cdk/dialog";

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
    private dialogRef: DialogRef
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  // tslint:disable-next-line:no-any
  uploadPhoto(event: any): void {
    console.log('UPLOAD_FLIE__________', event.target.files[0]);
    const file: File = event.target.files[0];

    this.fileSubject.next(file);
  }

  addPhoto(): void {
    this.dialogRef.close({ file: this.fileSubject.value })
  }

  private initForm(): void {
    this.addPhotoForm = this.fromBuilder.group({
      name: ['', Validators.required],
    })
  }
}
