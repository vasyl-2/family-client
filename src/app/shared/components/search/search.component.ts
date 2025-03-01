import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class SearchComponent implements ControlValueAccessor, OnInit {
  onTouched = () => {};
  onChange = (id: string) => {};

  @ViewChild('input', { static: true, read: ElementRef })
  inputElementRef!: ElementRef;

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {}

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value: string) {
    this.renderer.setProperty(
      this.inputElementRef.nativeElement,
      'value',
      value,
    );
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.inputElementRef.nativeElement,
      'disabled',
      isDisabled,
    );
  }

  clearInput() {
    this.renderer.setProperty(this.inputElementRef.nativeElement, 'value', '');
    this.onChange('');
  }

  onInputChange() {
    const value = this.inputElementRef.nativeElement.value;
    this.onChange(value);
  }

  onBlur() {
    this.onTouched();
  }
}
