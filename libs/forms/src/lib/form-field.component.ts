import {
  AfterContentInit,
  Component,
  computed,
  contentChild,
  DestroyRef,
  inject,
  signal
} from '@angular/core'
import { NgModel, NgModelGroup } from '@angular/forms'
import { tap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormSchemaDirective } from './form-schema.directive'

@Component({
  selector: '[form-field]',
  standalone: true,
  template: `
    <ng-content></ng-content>
    @if (validationErrorToShow(); as text) {
    <span class="text-red-500 rounded mb-4 ">
      {{ text }}
    </span>
    }
  `
})
export class FormFieldComponent implements AfterContentInit {
  #destroyRef = inject(DestroyRef)
  #formSchema = inject(FormSchemaDirective)

  protected ngModel = contentChild(NgModel)
  protected ngModelGroup = inject(NgModelGroup, { optional: true, skipSelf: true })

  protected isDirty = signal(false)

  protected validationError = signal('')

  protected validationErrorToShow = computed(() =>
    this.#formSchema.formIsSubmitted() || this.isDirty() ? this.validationError() : ''
  )

  ngAfterContentInit(): void {
    const statusChanges$ = this.#getControl().statusChanges

    // A ngModelGroup has no statusChanges stream available and yields null
    // We break in case of a ngModelGroup
    if (!statusChanges$) {
      return
    }

    statusChanges$
      .pipe(
        tap(status => (status === 'INVALID' ? this.#setError() : this.#clearError())),
        tap(() => this.isDirty.set(this.#getControl().dirty || false)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  #getControl() {
    const ngModel = this.ngModel()

    if (ngModel) {
      return ngModel
    }

    if (this.ngModelGroup) {
      return this.ngModelGroup
    }

    throw new Error(
      '[control-wrapper]: Expected either an instance of NgModelGroup or NgModel, but none was found.'
    )
  }

  #setError() {
    const errorMessage = this.#getControl().control.errors?.['schemaViolation']

    if (errorMessage) {
      this.validationError.set(errorMessage)
    }
  }

  #clearError() {
    this.validationError.set('')
  }
}
