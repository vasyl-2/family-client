import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Video } from '../../../models/video';
import { Photo } from '../../../models/photo';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-element',
  templateUrl: './video-element.component.html',
  styleUrls: ['./video-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoElementComponent implements OnDestroy {
  video!: string;
  videoObject!: Video;

  private sub = new Subscription();

  private readonly videoSubject = new BehaviorSubject<Photo | undefined>(
    undefined,
  );
  readonly video$ = this.videoSubject.asObservable();

  @Input() set videoSrc(video: Video) {
    this.videoObject = video;
    this.videoSubject.next(video);
    this.video = this.getAsset(video);
  }

  private getAsset(video: Video): string {
    const { fullPath, name } = video;
    console.log('VIDEO_____PATH___', video);

    let path = fullPath ? `${fullPath}/${name}` : name;
    path = `${environment.apiUrl}/${path}`;
    console.log('PATH___TOO___VIDEO_____', path);

    return path;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
