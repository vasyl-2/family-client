import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightChapterService {
  readonly chapterIdSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly chapterId$ = this.chapterIdSubject.asObservable();
}
