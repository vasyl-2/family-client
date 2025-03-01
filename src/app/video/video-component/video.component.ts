import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class VideoComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  getPhotosByChapter(chapter: string): void {
    // WITHOUT { relativeTo: this.route } broke
    this.router.navigate([chapter], { relativeTo: this.route });
  }
}
