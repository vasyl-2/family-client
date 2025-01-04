import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appSetHeight]',
})
export class SetHeightDirective implements AfterViewInit {
  rowSpan!: any;

  grid: { rowHeight: number; rowGap: number } | undefined | null;

  present = new BehaviorSubject(false);

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
      const img = this.el.nativeElement.querySelector('img');

      if (img) {
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
        this.renderer.listen(img, 'load', () => {
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
}
