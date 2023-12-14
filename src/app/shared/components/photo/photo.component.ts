import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {Photo} from "../../../models/photo";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoComponent implements OnInit {

  image!: string;

  @Input() set imageSrc(photo: string) {
    this.image = photo;
  };

  get imageSrc(): string {
    return this.image;
  }

  ngOnInit(): void {
  }

}
