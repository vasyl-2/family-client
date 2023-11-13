import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(
    private el: ElementRef, private renderer: Renderer2
  ) { }

  @HostListener('click', ['$event.target'])
  onClick(a: HTMLElement) {
    this.el.nativeElement.querySelectorAll('.mat-tree-node').forEach((c: Node) => {
      this.renderer.removeClass(c, 'highlight');
    })
    if (a.localName === 'span') {
      const parent = a.parentNode;
      this.renderer.addClass(parent, 'highlight');
    } else if (a.localName === 'div') {
      this.renderer.addClass(a, 'highlight');
    }
  }

}
