import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEnlarge]'
})
export class EnlargeDirective {
  @Input() set appEnlarge(scale: { curr: number, prev: number | undefined, step: number } | null) {
    if (scale) {
      const gridRowEnd = window.getComputedStyle(this.el.nativeElement).getPropertyValue('grid-row-end');
      const currentSpan = parseInt(gridRowEnd.split(' ')[1]);

      const { prev, curr } = scale;

      let newSpan;

      let multiPly: number = 2;

      if (!prev || (curr > prev)) {

        if (!prev) {
          multiPly = 2;
        } else {
          if (Math.abs(prev - curr) > 1) {
            multiPly = 4;
          } else {
            multiPly = 2;
          }
        }
        newSpan = currentSpan * multiPly;
      } else {


        if (Math.abs(prev - curr) > 1) {
          multiPly = 4;
        } else {
          multiPly = 2;
        }
        newSpan = currentSpan / multiPly;
      }

      this.renderer.setStyle(this.el.nativeElement, 'gridRowEnd', `span ${newSpan}`);
    }
  } ;

  constructor(
    private el: ElementRef, private renderer: Renderer2
  ) { }
}
