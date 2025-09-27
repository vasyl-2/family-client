import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

import {Pdf} from "../../../models/pdf";
import {environment} from "../../../../environments/environment";
import {EditDescriptionComponent} from "../edit-description/edit-description.component";


@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PdfComponent implements OnInit, OnDestroy {

  mediaName!: string;
  media!: Pdf;
  altText = 'pdf';

  private readonly sub = new Subscription();

  private readonly mediaSubject = new BehaviorSubject<Pdf | undefined>(
    undefined,
  );
  readonly media$ = this.mediaSubject.asObservable();

  @Input() set mediaSrc(media: Pdf) {
    this.media = media;
    this.mediaSubject.next(media);
    this.mediaName = this.getAsset(media);
    console.log('MEDIA___NAME____', this.mediaName)
  }

  @Output() updatedMedia = new EventEmitter<Partial<Pdf>>();
  @Output() mediaLoaded = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Pdf
  ) {}

  ngOnInit(): void {
    console.log('DATA_______PDF:', this.data);

    this.media = this.data;
    this.mediaSubject.next(this.data);
    this.mediaName = this.getAsset(this.data);
    console.log('MEDIA___NAME____', this.mediaName)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLoad(): void {
    this.mediaLoaded.emit();
  }

  edit(e: MouseEvent): void {
    e.stopPropagation();

    const { description, name: nameOfPhoto, date } = this.mediaSubject.value ?? {};

    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      data: { description, nameOfPhoto, date },
      height: '300px',
    });

    this.sub.add(
      dialogRef.afterClosed().subscribe(
        (result: {
              description: string | undefined;
              nameOfPhoto: string | undefined;
              date: Date | undefined;
            } | undefined) => {
          if (result) {
            let shouldBeUpdated = false;
            if (result.description) {
              if (
                this.mediaSubject.value &&
                this.mediaSubject.value?.description
              ) {
                if (
                  result.description !== this.mediaSubject.value?.description
                ) {
                  const currentValue = { ...this.mediaSubject.value } as Pdf;
                  currentValue.description = result.description;
                  this.mediaSubject.next(currentValue);
                  shouldBeUpdated = true;
                }
              } else {
                const currentValue = { ...this.mediaSubject.value! };
                currentValue.description = result.description;
                this.mediaSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            }

            if (result.nameOfPhoto) {
              if (this.mediaSubject.value?.name) {
                if (result.nameOfPhoto !== this.mediaSubject.value?.name) {
                  const currentValue = { ...this.mediaSubject.value! };
                  currentValue.name = result.nameOfPhoto;
                  this.mediaSubject.next(currentValue);
                  shouldBeUpdated = true;
                }
              } else {
                const currentValue = { ...this.mediaSubject.value! };
                currentValue.name = result.nameOfPhoto;
                this.mediaSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            }

            if (result.date) {
              if (this.mediaSubject.value?.date) {
                if (result.date !== this.mediaSubject.value?.date) {
                  const currentValue = { ...this.mediaSubject.value! };
                  currentValue.date = result.date;
                  this.mediaSubject.next(currentValue);
                  shouldBeUpdated = true;
                }
              } else {
                const currentValue = { ...this.mediaSubject.value! };
                currentValue.date = result.date;
                this.mediaSubject.next(currentValue);
                shouldBeUpdated = true;
              }
            }

            if (shouldBeUpdated) {
              this.updatedMedia.emit(this.mediaSubject.value);
            }
          }
        }
      )
    )
  }

  private getAsset(media: Pdf): string {
    const { fullPath, name } = media;
    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiStaticUrl}/${path}`;
    return path;
  }
}
