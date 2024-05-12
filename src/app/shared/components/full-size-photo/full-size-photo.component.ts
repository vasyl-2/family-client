import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';

import {Photo} from "../../../models/photo";
import {environment} from "../../../../environments/environment";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-full-size-photo',
  templateUrl: './full-size-photo.component.html',
  styleUrls: ['./full-size-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullSizePhotoComponent implements OnInit {
  // @Input() image!: Photo;

  path?: string;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public image: Photo,
  ) {
  }

  ngOnInit() {
    this.path = this.getAsset();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private getAsset(): string {
    const { fullPath, name } = this.image;
    let path =  fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiUrl}/${path}`;

    return path;
  }

}
