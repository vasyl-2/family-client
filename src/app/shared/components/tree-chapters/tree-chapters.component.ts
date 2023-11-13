import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit, QueryList, Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTree, MatTreeNestedDataSource} from "@angular/material/tree";

import {Chapter} from "../../../models/chapter";

@Component({
  selector: 'app-tree-chapters',
  templateUrl: './tree-chapters.component.html',
  styleUrls: ['./tree-chapters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeChaptersComponent),
      multi: true
    }
  ]
})
export class TreeChaptersComponent implements ControlValueAccessor, OnInit {
  @Input() chapters!: Chapter[] | null;

  treeControl = new NestedTreeControl<Chapter>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Chapter>();

  public control!: FormControl;
  private onChange!: (val: string) => void;
  private onTouched!: (val: string) => void;

  constructor(
    private render: Renderer2, private cdr: ChangeDetectorRef
  ) {
  }
  ngOnInit(): void {
    if (this.chapters) {
      this.dataSource.data = this.chapters;
      console.log('TREE________________________________', this.dataSource.data)
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }

  hasChild = (_: number, node: Chapter) => !!node.children && node.children.length > 0;

  selectChapter(chapter: Chapter): void {
    this.onChange(chapter._id!);
  }

}
