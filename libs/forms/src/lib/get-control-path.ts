import { AbstractControl, FormGroup } from '@angular/forms';

export function getControlPath(
  formGroup: FormGroup,
  controlName: string,
  control: AbstractControl | null
): string {
  for (const key in formGroup.controls) {
    if (Object.prototype.hasOwnProperty.call(formGroup.controls, key)) {
      const ctrl = formGroup.get(key);
      if (ctrl instanceof FormGroup) {
        const path = getControlPath(ctrl, controlName, control);

        if (path) {
          return key + '.' + path;
        }
      } else if (ctrl === control) {
        return key;
      }
    }
  }

  return '';
}
