import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEnlarge]'
})
export class EnlargeDirective {
  @Input() set appEnlarge(scale: { curr: number, prev: number | undefined } | null) {
    if (scale) {
      const gridRowEnd = window.getComputedStyle(this.el.nativeElement).getPropertyValue('grid-row-end');
      const currentSpan = parseInt(gridRowEnd.split(' ')[1]);

      let newSpan;

      if (!scale.prev || (scale.curr > scale.prev)) {
        newSpan = currentSpan * 2;
      } else {
        newSpan = currentSpan / 2;
      }

      this.renderer.setStyle(this.el.nativeElement, 'gridRowEnd', `span ${newSpan}`);
    }
  } ;

  constructor(
    private el: ElementRef, private renderer: Renderer2
  ) { }
}
