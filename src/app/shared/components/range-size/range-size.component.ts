import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-range-size',
  templateUrl: './range-size.component.html',
  styleUrls: ['./range-size.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSizeComponent),
      multi: true,
    },
  ],
})
export class RangeSizeComponent implements ControlValueAccessor, OnInit {
  onChange!: (size: number) => any;
  onTouch!: (size: number) => any;

  constructor() {}
  ngOnInit(): void {}

  registerOnChange(fn: (size: number) => any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {}

  writeValue(obj: any): void {}

  onInputChange(e: any) {
    console.log('VALUE_________________________', e);
    this.onChange(e.target.value);
  }
}
