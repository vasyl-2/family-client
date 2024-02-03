import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appEnlarge]'
})
export class EnlargeDirective {
  constructor(
    private el: ElementRef, private renderer: Renderer2
  ) { }

  @HostListener('click', ['$event.target'])
  onClick(element: HTMLElement) {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.7)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.25s ease');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '20');
  }

  @HostListener('mouseleave')
  onHover() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.25s ease');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', 'unset');
  }
}
