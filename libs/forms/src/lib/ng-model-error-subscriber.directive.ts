import { AfterViewInit, DestroyRef, Directive, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgControl } from '@angular/forms'
import { tap } from 'rxjs'
import { FormSchemaDirective } from './form-schema.directive'
import { getControlPath } from './get-control-path'

@Directive({
  selector: '[ngModel]',
  standalone: true
})
export class NgModelErrorSubscriberDirective implements AfterViewInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #ngControl = inject(NgControl)
  readonly #formSetting = inject(FormSchemaDirective)

  ngAfterViewInit(): void {
    this.#bindFormSettingErrors().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe()
  }

  #bindFormSettingErrors() {
    return this.#formSetting.errors$.pipe(
      tap(errors => {
        const controlPath = getControlPath(
          this.#formSetting.ngForm.control,
          this.#ngControl.name?.toString() || '',
          this.#ngControl.control
        )
        const error = errors?.[controlPath] ?? null

        if (error) this.#ngControl.control?.setErrors(error)
      })
    )
  }
}
