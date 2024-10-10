import { afterNextRender, DestroyRef, Directive, inject, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgControl } from '@angular/forms'
import { filter, map, tap } from 'rxjs'
import { FormSchemaDirective } from './form-schema.directive'
import { getControlPath } from './get-control-path'

@Directive({
  selector: '[ngModel]',
  standalone: true
})
export class NgModelErrorSubscriberDirective {
  readonly #destroyRef = inject(DestroyRef)
  readonly #ngControl = inject(NgControl)
  readonly #formSchema = inject(FormSchemaDirective)

  name = input.required<NgControl['name']>()

  constructor() {
    afterNextRender(() => this.#listenForControlErrors())
  }

  #listenForControlErrors() {
    return this.#formSchema.errors$
      .pipe(
        map(errors => ({ errors, controlPath: this.#buildControlPath() })),
        map(({ errors, controlPath }) => errors?.[controlPath] ?? null),
        filter(maybeError => !!maybeError),
        tap(error => this.#ngControl.control?.setErrors(error)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  #buildControlPath() {
    return getControlPath(
      this.#formSchema.ngForm.control,
      this.#ngControl.name?.toString() || '',
      this.#ngControl.control
    )
  }
}
