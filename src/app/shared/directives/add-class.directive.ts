import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAddClass]',
  standalone: false,
})
export class AddClassDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: PointerEvent) {
    event.stopPropagation();
    this.el.nativeElement.classList.toggle('open');
  }
}
