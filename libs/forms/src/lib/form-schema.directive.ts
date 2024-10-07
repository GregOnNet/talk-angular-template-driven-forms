import {
  AfterViewInit,
  DestroyRef,
  Directive,
  inject,
  input,
  InputSignal,
  output,
  signal
} from '@angular/core'
import {
  outputFromObservable,
  outputToObservable,
  takeUntilDestroyed
} from '@angular/core/rxjs-interop'
import { NgForm } from '@angular/forms'
import { BehaviorSubject, debounceTime, switchMap, tap } from 'rxjs'
import { BaseIssue, BaseSchemaAsync, InferOutput, safeParseAsync } from 'valibot'
import { PartialDeep } from 'type-fest'

type InferInputSignalValue<TSignal> = TSignal extends InputSignal<infer TValue> ? TValue : never

@Directive({
  selector: '[formSchema]',
  standalone: true
})
export class FormSchemaDirective<TInput, TOutput, TIssue extends BaseIssue<unknown>>
  implements AfterViewInit
{
  #destroyRef = inject(DestroyRef)

  ngForm = inject(NgForm, { self: true })

  formSchema = input.required<BaseSchemaAsync<TInput, TOutput, TIssue>>()

  safeSubmit = output<InferOutput<InferInputSignalValue<typeof this.formSchema>>>()

  valueChanged = outputFromObservable<
    PartialDeep<InferOutput<InferInputSignalValue<typeof this.formSchema>>>
  >(this.ngForm.valueChanges!.pipe(debounceTime(0)))

  schemaViolations$ = new BehaviorSubject<Record<string, { schemaViolation: string }> | null>(null)
  formIsSubmitted = signal(false)

  ngAfterViewInit(): void {
    this.validateFormValuesOnValueChange()
    this.emitSafeSubmitWhenValidationSucceeds()

    // TODO: Extract in to method
    this.ngForm.onReset = () => {
      this.ngForm.onReset()
      this.formIsSubmitted.set(false)
    }
  }

  private validateFormValuesOnValueChange() {
    outputToObservable(this.valueChanged)
      .pipe(
        switchMap(() => this.validate()),
        tap(result => this.schemaViolations$.next(result)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  private emitSafeSubmitWhenValidationSucceeds() {
    this.ngForm.ngSubmit
      .pipe(
        switchMap(() => safeParseAsync(this.formSchema(), this.ngForm.value)),
        tap(result => (result.success ? this.safeSubmit.emit(result.output) : {})),
        // TODO: Extract since is another concern having nothing to do with validation
        tap(() => this.formIsSubmitted.set(true)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  private async validate(): Promise<Record<string, { schemaViolation: string }> | null> {
    const result = await safeParseAsync(this.formSchema(), this.ngForm.value)

    if (result.success) {
      return null
    }

    return result.issues.reduce((record, error) => {
      const path = error.path?.map((segment: any) => segment.key).join('.')

      if (!path) return record

      return Object.assign(record, { [path]: { schemaViolation: error.message } })
    }, {})
  }
}
