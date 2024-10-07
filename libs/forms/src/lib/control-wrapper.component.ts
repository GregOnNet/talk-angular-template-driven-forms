import {
  AfterContentInit,
  Component,
  computed,
  contentChild,
  DestroyRef,
  inject,
  signal
} from '@angular/core'
import { ControlContainer, NgForm, NgModel, NgModelGroup } from '@angular/forms'
import { tap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: '[control-wrapper]',
  standalone: true,
  template: `
    <ng-content></ng-content>
    @if (validationErrorToShow(); as text) {
    <p class="border-2 border-red-400 text-red-100 rounded p-2 font-medium">
      {{ text }}
    </p>
    }
  `,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ControlWrapperComponent implements AfterContentInit {
  #destroyRef = inject(DestroyRef)

  protected ngModel = contentChild(NgModel)
  protected ngModelGroup = inject(NgModelGroup, { optional: true, skipSelf: true })

  protected isDirty = signal(false)

  protected validationError = signal('')

  protected validationErrorToShow = computed(() => (this.isDirty() ? this.validationError() : ''))

  ngAfterContentInit(): void {
    const statusChanges$ = this.#getControl().statusChanges

    // A ngModelGroup has no statusChanges stream and yields null
    // We break in case of a ngModelGroup
    if (!statusChanges$) {
      return
      // throw new Error('[control-wrapper]: Expected valueChanges-Stream to be initialized')
    }

    // Immer wenn sich Status zu Fehler ändert
    // lesen wir den Fehler aus
    // und zeigen ihn an.
    statusChanges$
      .pipe(
        tap(status => (status === 'INVALID' ? this.#setError() : this.#clearError())),
        tap(() => this.isDirty.set(this.#getControl().dirty || false)),
        tap(() => console.log('Status Change', this.#getControl().name)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  // protected get isErrorRequiredToBeDisplayed(): boolean {
  //   return !!this.matFormField.ngModel?.errors
  // }

  // protected get error() {
  //   const errors = this.matFormField.ngModel?.errors
  //
  //   if (hasOwnProperty(errors, 'auto')) {
  //     return errors.auto
  //   }
  //
  //   throw new Error('Expected "suiteError", but nothing was found.')
  // }

  #getControl() {
    const ngModel = this.ngModel()

    if (ngModel) {
      console.log('[control-wrapper -> ngModel]', ngModel.name)
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
    console.log(
      '[control-wrapper] -> ngModel',
      this.#getControl().name,
      this.#getControl().control.errors
    )
    const errorMessage = this.#getControl().control.errors?.['schemaViolation']

    if (errorMessage) {
      this.validationError.set(errorMessage)
    }
  }

  #clearError() {
    this.validationError.set('')
  }
}

function hasOwnProperty<X extends object, Y extends PropertyKey>(
  candidate: X | undefined | null,
  propertyKey: Y
): candidate is X & Record<Y, unknown> {
  return !candidate ? false : Object.prototype.hasOwnProperty.call(candidate, propertyKey)
}
