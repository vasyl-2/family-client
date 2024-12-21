import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rolesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Array.isArray(value) && value.length > 0 ? null : { atLeastOneRequired: true };
  };
}
