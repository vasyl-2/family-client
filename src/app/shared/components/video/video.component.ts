import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output, signal,
  ViewChild
} from '@angular/core';
import {Photo} from "../../../models/photo";
import {BehaviorSubject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EditDescriptionComponent} from "../edit-description/edit-description.component";
import {environment} from "../../../../environments/environment";
import {Video} from "../../../models/video";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class VideoComponent {
  @ViewChild('videoEl', { static: false, read: ElementRef })
  videoRef!: ElementRef<HTMLVideoElement>;

  videoString!: string;
  video!: Video;
  isFullScreen$ = new BehaviorSubject(false);

  private sub = new Subscription();

  private readonly photoSubject = new BehaviorSubject<Video | undefined>(
    undefined,
  );
  readonly video$ = this.photoSubject.asObservable();

  @Input() set videoSrc(video: Video) {
    this.video = video;
    this.photoSubject.next(video);
    this.videoString = this.getAsset(video);
  }

  @Output() updatedVideo = new EventEmitter<Partial<Video>>();
  // @Output() imageLoaded = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLoad(e: unknown): void {
    console.log('VE______________', e)
    // this.imageLoaded.emit();
  }

  onChangeFullScreen(e: HTMLVideoElement) {
    console.log('CHANGED___FULL_SCREEN____', e);
    const fullScreenedEl = this.document.fullscreenElement;

    if (fullScreenedEl) {
      this.isFullScreen$.next(true);
      const isEl = this.videoRef.nativeElement === e;
      console.log('IS_________', isEl)
      console.log('fullScreenedEl______________', fullScreenedEl);
      this.cdr.markForCheck();
    } else {
      this.isFullScreen$.next(false);
    }
  }

  edit(e: MouseEvent): void {
    e.stopPropagation();
    console.log('EDIT___PHOTO___');
    const description = this.photoSubject.value?.description;
    const nameOfPhoto = this.photoSubject.value?.name;

    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      data: { description, nameOfPhoto },
      height: '300px',
    });

    this.sub.add(
      dialogRef
        .afterClosed()
        .subscribe(
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
              console.log('RESULT_44444$$$$')
              let shouldBeUpdated = false;
              if (result.description) {
                if (this.photoSubject.value && this.photoSubject.value?.description) {
                  if (
                    result.description !== this.photoSubject.value?.description
                  ) {
                    const currentValue = { ...this.photoSubject.value } as Video;
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
                console.log(
                  'TO___UPDATE_____________',
                  this.photoSubject.value,
                );
                this.updatedVideo.emit(this.photoSubject.value);
              }
            }
          },
        ),
    );
  }

  private getAsset(video: Video): string {
    const { fullPath, name } = video;
    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiStaticUrl}/${path}`;
    return path;
  }
}
