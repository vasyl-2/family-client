import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

import {Photo} from "../../../models/photo";
import {environment} from "../../../../environments/environment";
import {EditDescriptionComponent} from "../edit-description/edit-description.component";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoComponent implements OnDestroy {

  image!: string;
  photo!: Photo;

  private sub = new Subscription();

  private readonly photoSubject = new BehaviorSubject<Photo | undefined>(undefined);
  readonly photo$ = this.photoSubject.asObservable();

  @Input() set imageSrc(photo: Photo) {
    this.photo = photo;
    this.photoSubject.next(photo);
    this.image = this.getAsset(photo);
  };

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  edit(): void {
    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      data: { description: this.photoSubject.value?.description, nameOfPhoto: this.photoSubject.value?.name },
      height: '300px'
    });

    this.sub.add(
      dialogRef.afterClosed().subscribe((result: { description: string | undefined; nameOfPhoto: string | undefined} | undefined) => {
        if (result) {
          console.log(`Dialog result1: ${result.description}`);
          console.log(`Dialog result2: ${result.nameOfPhoto}`);
        }

      })
    );

  }

  private getAsset(photo: Photo): string {
    const { fullPath, name } = photo;
    let path =  fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiUrl}/${path}`;

    return path;
  }


}
