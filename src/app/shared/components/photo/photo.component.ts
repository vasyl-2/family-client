import { ChangeDetectionStrategy, Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

import { Photo } from "../../../models/photo";
import { environment } from "../../../../environments/environment";
import { EditDescriptionComponent } from "../edit-description/edit-description.component";

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

  @Output() updatedPhoto = new EventEmitter<Partial<Photo>>();
  @Output() imageLoaded = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLoad(): void {
    this.imageLoaded.emit();
  }

  edit(): void {
    const description = this.photoSubject.value?.description;
    const nameOfPhoto = this.photoSubject.value?.name;

    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      data: { description, nameOfPhoto },
      height: '300px'
    });

    this.sub.add(
      dialogRef.afterClosed().subscribe((result: { description: string | undefined; nameOfPhoto: string | undefined} | undefined) => {
        if (result) {
          let shouldBeUpdated = false;
          if (result.description) {
            if (this.photoSubject.value?.description) {
              if (result.description !== this.photoSubject.value?.description) {
                const currentValue = { ...this.photoSubject.value };
                currentValue.description = result.description;
                this.photoSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            } else {
              const currentValue = {...this.photoSubject.value! };
              currentValue.description = result.description;
              this.photoSubject.next(currentValue);
              shouldBeUpdated = true;
            }
          }

          if (result.nameOfPhoto) {
            if (this.photoSubject.value?.name) {
              if (result.nameOfPhoto !== this.photoSubject.value?.name) {

                const currentValue = {...this.photoSubject.value!};
                currentValue.name = result.nameOfPhoto;
                this.photoSubject.next(currentValue);

                // this.photoSubject.value.name = result.nameOfPhoto;
                shouldBeUpdated = true;
              }
            } else {
              const currentValue = { ...this.photoSubject.value! };
              currentValue.name = result.nameOfPhoto;
              this.photoSubject.next(currentValue);
              // this.photoSubject.value!.name = result.nameOfPhoto;
              shouldBeUpdated = true;
            }
          }

          if (shouldBeUpdated) {
            console.log('TO___UPDATE_____________', this.photoSubject.value)
            this.updatedPhoto.emit(this.photoSubject.value);
          }

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
