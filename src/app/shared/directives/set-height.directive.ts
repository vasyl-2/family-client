import { ChangeDetectorRef, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSetHeight]'
})
export class SetHeightDirective {

  @Input() set appSetHeight(grid: { rowHeight: number; rowGap: number } | undefined | null) {
    if (grid) {
      const { height } = this.el.nativeElement.querySelector('.content').getBoundingClientRect();
      console.log('HEIGHT____OF_____ELEM', height)
      const calculated = (height + grid.rowGap) / (grid.rowHeight + grid.rowGap);
      const rowSpan = Math.ceil(calculated);

      console.log('SPAN______', rowSpan);
      this.renderer.setStyle(this.el.nativeElement, 'gridRowEnd', `span ${rowSpan}`);
      this.cdr.detectChanges();
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}
}
