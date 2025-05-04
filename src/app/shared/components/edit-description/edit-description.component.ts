import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class EditDescriptionComponent implements OnInit {
  photoForm!: FormGroup;
  today!: Date;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  get descriptionControl(): FormControl {
    return this.photoForm.get('description') as FormControl;
  }

  get nameOfPhotoControl(): FormControl {
    return this.photoForm.get('nameOfPhoto') as FormControl;
  }

  get dateOfPhotoControl(): FormControl {
    return this.photoForm.get('dateOfPhoto') as FormControl;
  }

  private sub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      description: string | undefined;
      nameOfPhoto: string | undefined;
      date: Date | undefined;
    },
    private fB: FormBuilder,
  ) {}

  ngOnInit(): void {
    console.log('EDIT__COMPONENT____');
    this.today = new Date(new Date().getTime());

    this.setPhotoForm();

    if (!!this.data) {
      if (this.data.description) {
        this.descriptionControl.setValue(this.data.description);
      }
      if (this.data.nameOfPhoto) {
        this.nameOfPhotoControl.setValue(this.data.nameOfPhoto);
      }

      if (this.data.date) {
        this.dateOfPhotoControl.setValue(this.data.date);
      }
    }

    this.subscribeToDescriptionChange();
    this.subscribeToNameOfPhotoChange();
    this.subscribeToDateOfPhotoChange();
  }

  close(): void {
    this.dialogRef.close();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>): void {
    console.log('TYPE____', type);
    console.log('EVENT_____', event);
  }

  private subscribeToDescriptionChange(): void {
    this.sub = this.descriptionControl.valueChanges
      .pipe()
      .subscribe((val: string) => {
        this.data.description = val;
      });
  }

  private subscribeToNameOfPhotoChange(): void {
    this.sub = this.nameOfPhotoControl.valueChanges
      .pipe()
      .subscribe((val: string) => {
        this.data.nameOfPhoto = val;
      });
  }

  private subscribeToDateOfPhotoChange(): void {
    this.sub = this.dateOfPhotoControl.valueChanges.subscribe((val: Date) => {
      this.data.date = val;
    });
  }

  private setPhotoForm(): void {
    this.photoForm = this.fB.group({
      description: '',
      nameOfPhoto: '',
      dateOfPhoto: '',
    });
  }
}
