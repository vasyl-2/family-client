import { Directive, Input, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { filter } from 'rxjs/operators';
import { HighlightChapterService } from '../../services/highlight-chapter.service';
import { Chapter } from '../../models/chapter';

@Directive({
  selector: '[appExpandPath]',
  standalone: false,
})
export class ExpandPathDirective implements OnInit {
  @Input({ required: true }) appExpandPathTreeControl!: NestedTreeControl<Chapter>;
  @Input({ required: true }) appExpandPathChapters!: Chapter[] | null;

  constructor(private highlightChapterService: HighlightChapterService) {}

  ngOnInit(): void {
    this.highlightChapterService.chapterId$
      .pipe(filter((id): id is string => !!id))
      .subscribe((id) => {
        if (!this.appExpandPathChapters) return;

        const path = this.findPathToId(this.appExpandPathChapters, id);
        path?.forEach((node) => this.appExpandPathTreeControl.expand(node));
      });
  }

  private findPathToId(
    chapters: Chapter[],
    targetId: string,
    path: Chapter[] = [],
  ): Chapter[] | null {
    for (const chapter of chapters) {
      const currentPath = [...path, chapter];

      if (chapter._id === targetId) {
        return currentPath;
      }

      if (chapter.children?.length) {
        const found = this.findPathToId(chapter.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  }
}
