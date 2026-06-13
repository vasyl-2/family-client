import {
  AfterViewInit, DestroyRef,
  Directive,
  ElementRef,
  Input, OnDestroy,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Directive({
  selector: '[appSetHeight]',
  standalone: false,
})
export class SetHeightDirective implements AfterViewInit, OnDestroy {
  private rowSpan!: number;

  private grid: { rowHeight: number; rowGap: number } | undefined | null;

  private readonly present = new BehaviorSubject(false);

  @Input() typeOfMedia: 'video' | 'img' | undefined = undefined;

  private readonly typeToProp = {
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
    private destroyRef: DestroyRef
  ) {}

  ngAfterViewInit() {
    this.present.pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.subscribeToPresent());
  }

  private setRowSpan():void {
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
  }

  private subscribeToPresent(): void {
    if (!this.typeOfMedia) {
      return;
    }

    const media = this.el.nativeElement.querySelector(
      this.typeToProp[this.typeOfMedia],
    );

    if (media) {
      this.setRowSpan();
      this.renderer.listen(media, 'load', () => this.setRowSpan());
    }
  }

  ngOnDestroy() {
    // this.destroyRef.
  }
}
