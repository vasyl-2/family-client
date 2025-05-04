import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { Chapter } from '../../../models/chapter';

@Component({
  selector: 'app-tree-chapters',
  templateUrl: './tree-chapters.component.html',
  styleUrls: ['./tree-chapters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeChaptersComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class TreeChaptersComponent implements ControlValueAccessor, OnInit {
  @Input() chapters!: Chapter[] | null;

  treeControl = new NestedTreeControl<Chapter>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<Chapter>();

  public control!: FormControl;
  private onChange!: (val: string) => void;
  private onTouched!: (val: string) => void;

  ngOnInit(): void {
    if (this.chapters) {
      this.dataSource.data = this.chapters;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {}

  writeValue(id: string): void {
    // if (this.chapters) {
    //   const chapter = this.findChapterByIdInArray(this.chapters, id);
    //   if (chapter) {
    //     console.log('NEW__CHAPTER_SELECTED___', chapter);
    //     this.treeControl.toggle(chapter)
    //
    //   }
    // }
  }

  hasChild = (_: number, node: Chapter) =>
    !!node.children && node.children.length > 0;

  selectChapter(chapter: Chapter): void {
    this.onChange(chapter._id!);
  }

  private findChapterById(
    rootChapter: Chapter,
    targetChapterId: string,
  ): Chapter | null {
    // Check if the current chapter is the one we are looking for
    if (rootChapter._id === targetChapterId) {
      return rootChapter;
    }

    // Recursively search through the children
    if (rootChapter.children && rootChapter.children.length > 0) {
      for (const child of rootChapter.children) {
        const foundChapter = this.findChapterById(child, targetChapterId);
        if (foundChapter) {
          return foundChapter; // Return the first match found in the recursion
        }
      }
    }

    // If the target chapter is not found in the current branch, return null
    return null;
  }

  private findChapterByIdInArray(
    chapters: Chapter[],
    targetChapterId: string,
  ): Chapter | null {
    for (const rootChapter of chapters) {
      const foundChapter = this.findChapterById(rootChapter, targetChapterId);
      if (foundChapter) {
        return foundChapter; // Return the first match found in the array
      }
    }

    // If the target chapter is not found in any branch, return null
    return null;
  }
}
