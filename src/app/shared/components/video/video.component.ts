import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  DOCUMENT
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditDescriptionComponent } from '../edit-description/edit-description.component';
import { environment } from '../../../../environments/environment';
import {PhotoMedia} from "../../../models/photo";


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class VideoComponent {
  @ViewChild('videoEl', { static: false, read: ElementRef })
  videoRef!: ElementRef<HTMLVideoElement>;

  videoString!: string;
  video!: PhotoMedia;
  isFullScreen$ = new BehaviorSubject(false);

  private sub = new Subscription();

  private readonly photoSubject = new BehaviorSubject<PhotoMedia | undefined>(
    undefined,
  );
  readonly video$ = this.photoSubject.asObservable();

  @Input() set videoSrc(video: PhotoMedia) {
    this.video = video;
    this.photoSubject.next(video);
    this.videoString = this.getAsset(video);
  }

  @Output() updatedVideo = new EventEmitter<Partial<PhotoMedia>>();
  @Output() videoLoaded = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLoad(e: unknown): void {
    this.videoLoaded.emit(e);
  }

  onChangeFullScreen(e: HTMLVideoElement) {
    const fullScreenedEl = this.document.fullscreenElement;

    if (fullScreenedEl) {
      this.isFullScreen$.next(true);
      const isEl = this.videoRef.nativeElement === e;
      this.cdr.markForCheck();
    } else {
      this.isFullScreen$.next(false);
    }
  }

  edit(e: MouseEvent): void {
    e.stopPropagation();
    const description = this.photoSubject.value?.description;
    const nameOfPhoto = this.photoSubject.value?.name;

    const dialogRef = this.dialog.open(EditDescriptionComponent, {
      data: { description, nameOfPhoto },
      height: '300px',
    });

    this.sub.add(
      dialogRef.afterClosed().subscribe(
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
              this.updatedVideo.emit(this.photoSubject.value);
            }
          }
        },
      ),
    );
  }

  private getAsset(video: PhotoMedia): string {
    const { fullPath, name } = video;
    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiStaticUrl}/${path}`;
    return path;
  }
}
