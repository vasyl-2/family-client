import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

import {HighlightChapterService} from "../../services/highlight-chapter.service";
import {filter} from "rxjs/operators";

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {


  constructor(
    private el: ElementRef, private renderer: Renderer2,
    private highlightChapterService: HighlightChapterService
  ) { }

  ngOnInit(): void {
    this.highlightChapterService.chapterId$
      .pipe(filter((id: string | undefined) => !!id))
      .subscribe((id: string | undefined) => {
        if (id) {
          const a = this.findElementById(this.el.nativeElement, id);
          if (a) {
            console.log('Element found____________________________:', a);
            this.el.nativeElement.querySelectorAll('.mat-tree-node').forEach((c: Node) => {
              this.renderer.removeClass(c, 'highlight');
            })
            if (a.localName === 'span') {
              const parent = a.parentNode;
              this.renderer.addClass(parent, 'highlight');
            } else if (a.localName === 'div') {
              this.renderer.addClass(a, 'highlight');
            }

          } else {
            console.log('Element not found_____________________________________');
          }
        }
      })
  }

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

  private findElementById(element: HTMLElement, id: string): HTMLElement | null {
    if (element.id === id) {
      return element;
    }

    for (let i = 0; i < element.children.length; i++) {
      const found = this.findElementById(element.children[i] as HTMLElement, id);
      if (found) {
        return found;
      }
    }

    return null;
  }

}
