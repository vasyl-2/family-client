import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {Subscription} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDescriptionComponent implements OnInit {


  photoForm!: FormGroup;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  // descriptionControl: FormControl = new FormControl<string>('');

  get descriptionControl(): FormControl {
    return this.photoForm.get('description') as FormControl;
  }

  get nameOfPhotoControl(): FormControl {
    return this.photoForm.get('nameOfPhoto') as FormControl;
  }


  private sub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      description: string | undefined,
      nameOfPhoto: string | undefined
    },
    private fB: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('THIS___DATA____', this.data);

    this.setPhotoForm();

    if(!!this.data) {
      if (this.data.description) {
        this.descriptionControl.setValue(this.data.description);
      }
      if (this.data.nameOfPhoto) {
        console.log('NAME___OF____PHOTO______', this.data.nameOfPhoto);
        this.nameOfPhotoControl.setValue(this.data.nameOfPhoto);
      }
    }

    this.subscribeToDescriptionChange();
    this.subscribeToNameOfPhotoChange();
  }

  close(): void {
    this.dialogRef.close()
  }

  private subscribeToDescriptionChange(): void {
    this.sub = this.descriptionControl.valueChanges.pipe(
      // distinctUntilChanged(),
    ).subscribe((val: string) => {
      console.log('DESCR___________', val);
      this.data.description = val;
    })
  }

  private subscribeToNameOfPhotoChange(): void {
    this.sub = this.nameOfPhotoControl.valueChanges.pipe(
      // distinctUntilChanged(),
    ).subscribe((val: string) => {
      console.log('NAME___OF____PHOTO________________', val);
      this.data.nameOfPhoto = val;
    })
  }

  private setPhotoForm(): void {
    this.photoForm = this.fB.group({
      description: '',
      nameOfPhoto: ''
    });
  }

}
