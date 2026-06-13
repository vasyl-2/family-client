import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter, DestroyRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { PhotoMedia } from '../../../models/photo';
import { environment } from '../../../../environments/environment';
import { EditDescriptionComponent } from '../edit-description/edit-description.component';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PhotoComponent implements OnDestroy {
  image!: string;
  photo!: PhotoMedia;

  private sub = new Subscription();

  private readonly photoSubject = new BehaviorSubject<PhotoMedia | undefined>(
    undefined,
  );
  readonly photo$ = this.photoSubject.asObservable();

  @Input() set imageSrc(photo: PhotoMedia) {
    this.photo = photo;
    this.photoSubject.next(photo);
    this.image = this.getAsset(photo);
  }

  @Output() updatedPhoto = new EventEmitter<Partial<PhotoMedia>>();
  @Output() imageLoaded = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private destroyRef: DestroyRef
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLoad(): void {
    this.imageLoaded.emit();
  }

  edit(e: MouseEvent): void {
    e.stopPropagation();
    const description = this.photoSubject.value?.description;
    const nameOfPhoto = this.photoSubject.value?.name;
    const date = this.photoSubject.value?.date;

    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      data: { description, nameOfPhoto, date },
      height: '300px',
    });

    this.sub.add(
      dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        (
          result:
            | {
                description: string | undefined;
                nameOfPhoto: string | undefined;
                date: Date | undefined;
              }
            | undefined,
        ) => {
          if (result) {
            let shouldBeUpdated = false;
            if (result.description) {
              if (
                this.photoSubject.value &&
                this.photoSubject.value?.description
              ) {
                if (
                  result.description !== this.photoSubject.value?.description
                ) {
                  const currentValue = { ...this.photoSubject.value } as PhotoMedia;
                  currentValue.description = result.description;
                  this.photoSubject.next(currentValue);
                  shouldBeUpdated = true;
                }
              } else {
                const currentValue = { ...this.photoSubject.value! };
                currentValue.description = result.description;
                this.photoSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            }

            if (result.nameOfPhoto) {
              if (this.photoSubject.value?.name) {
                if (result.nameOfPhoto !== this.photoSubject.value?.name) {
                  const currentValue = { ...this.photoSubject.value! };
                  currentValue.name = result.nameOfPhoto;
                  this.photoSubject.next(currentValue);
                  shouldBeUpdated = true;
                }
              } else {
                const currentValue = { ...this.photoSubject.value! };
                currentValue.name = result.nameOfPhoto;
                this.photoSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            }

            if (result.date) {
              if (this.photoSubject.value?.date) {
                if (result.date !== this.photoSubject.value?.date) {
                  const currentValue = { ...this.photoSubject.value! };
                  currentValue.date = result.date;
                  this.photoSubject.next(currentValue);
                  shouldBeUpdated = true;
                }
              } else {
                const currentValue = { ...this.photoSubject.value! };
                currentValue.date = result.date;
                this.photoSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            }

            if (shouldBeUpdated) {
              this.updatedPhoto.emit(this.photoSubject.value);
            }
          }
        },
      ),
    );
  }

  private getAsset(photo: PhotoMedia): string {
    const { fullPath, name } = photo;
    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiStaticUrl}/${path}`;
    return path;
  }
}
