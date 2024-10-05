import { AfterViewInit, DestroyRef, Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { tap } from 'rxjs';
import { FormSettingDirective } from './form-setting.directive';
import { getControlPath } from './get-control-path';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngModel]',
  standalone: true,
})
export class NgModelErrorSubscriberDirective implements AfterViewInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #ngControl = inject(NgControl);
  readonly #formSetting = inject(FormSettingDirective);

  ngAfterViewInit(): void {
    this.#bindFormSettingErrors().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();
  }

  #bindFormSettingErrors() {
    return this.#formSetting.errors$.pipe(
      tap((errors) => {
        const controlPath = getControlPath(
          this.#formSetting.ngForm.control,
          this.#ngControl.name?.toString() || '',
          this.#ngControl.control
        );
        const error = errors?.[controlPath] ?? null;

        if (error) this.#ngControl.control?.setErrors(error);
      })
    );
  }
}
