import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDescriptionComponent implements OnInit {


  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  descriptionControl: FormControl = new FormControl<string>('');

  constructor(
    public dialogRef: MatDialogRef<EditDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    console.log('THIS___DATA____', this.data);

    if(!!this.data) {
      this.descriptionControl.setValue(this.data);
    }
  }

  close(): void {
    this.dialogRef.close()
  }
}
