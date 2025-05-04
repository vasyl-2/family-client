import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
} from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Permission } from '../../../models/permission';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-permission',
  templateUrl: './select-permission.component.html',
  styleUrls: ['./select-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectPermissionComponent,
      multi: true,
    },
  ],
  standalone: false,
})
export class SelectPermissionComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  show = true;
  private ready = new BehaviorSubject(false);
  @Input() permissions!: Permission[] | undefined | null;

  public control!: FormControl;
  private onChange!: (val: string[]) => void;
  private onTouched!: (val: string[]) => void;

  private sub = new Subscription();

  constructor(
    private parent: ControlContainer,
    @Inject(Injector) private injector: Injector,
  ) {}

  ngOnInit(): void {
    this.setControl();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  registerOnChange(fn: (val: string[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: (val: string[]) => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  writeValue(selectedRoles: string[] | null): void {
    this.ready.pipe(filter(Boolean)).subscribe(() => {
      if (selectedRoles) {
        console.log('SELECTED___ROLES_____', selectedRoles);
        this.control.setValue(selectedRoles, { emitEvent: false });
      }
    });
  }

  onSelectionChange(selectedRoles: string[]) {
    console.log('WHOLE___VALUE_____', this.control.value);

    if (this.onChange) {
      this.onChange(selectedRoles);
    }
    // if (this.onTouched) {
    //   this.onTouched(selectedRoles);
    // }
  }

  private setControl(): void {
    const injectedControl = this.injector.get(NgControl);

    switch (injectedControl.constructor) {
      case NgModel: {
        const { control, update } = injectedControl as NgModel;

        this.control = control;

        this.sub.add(
          this.control.valueChanges
            .pipe(tap((value) => update.emit(value)))
            .subscribe(),
        );
        break;
      }

      case FormControlName: {
        this.control = this.injector
          .get(FormGroupDirective)
          .getControl(injectedControl as FormControlName);
        break;
      }

      default: {
        this.control = (injectedControl as FormControlDirective)
          .form as FormControl;
        break;
      }
    }

    this.ready.next(true);
  }
}
