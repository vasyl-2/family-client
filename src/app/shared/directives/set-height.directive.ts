import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input, OnDestroy,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appSetHeight]',
  standalone: false,
})
export class SetHeightDirective implements AfterViewInit, OnDestroy {
  private rowSpan!: number;

  private grid: { rowHeight: number; rowGap: number } | undefined | null;

  private readonly present = new BehaviorSubject(false);

  @Input() typeOfMedia: 'video' | 'img' | undefined = undefined;

  private typeToProp = {
    img: 'img',
    video: 'video',
  };

  @Input() set appSetHeight(
    grid: { rowHeight: number; rowGap: number } | undefined | null,
  ) {
    if (grid) {
      this.grid = grid;
      this.present.next(true);
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.present.pipe(filter(Boolean)).subscribe((p) => {
      if (!this.typeOfMedia) {
        return;
      }

      const media = this.el.nativeElement.querySelector(
        this.typeToProp[this.typeOfMedia],
      );

      if (media) {
        const { height } = this.el.nativeElement
          .querySelector('.content')
          .getBoundingClientRect();

        const calculated =
          (height + this.grid!.rowGap) /
          (this.grid!.rowHeight + this.grid!.rowGap);
        this.rowSpan = Math.ceil(calculated);
        this.renderer.setStyle(
          this.el.nativeElement,
          'gridRowEnd',
          `span ${this.rowSpan}`,
        );
        this.renderer.listen(media, 'load', () => {
          const { height } = this.el.nativeElement
            .querySelector('.content')
            .getBoundingClientRect();
          const calculated =
            (height + this.grid!.rowGap) /
            (this.grid!.rowHeight + this.grid!.rowGap);
          this.rowSpan = Math.ceil(calculated);
          this.renderer.setStyle(
            this.el.nativeElement,
            'gridRowEnd',
            `span ${this.rowSpan}`,
          );
        });
      }
    });
  }

  ngOnDestroy() {

  }
}
