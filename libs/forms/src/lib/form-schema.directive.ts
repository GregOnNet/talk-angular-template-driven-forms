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
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgForm } from '@angular/forms'
import { BehaviorSubject, debounceTime, switchMap, tap } from 'rxjs'
import { PartialDeep } from 'type-fest'
import { BaseIssue, BaseSchemaAsync, InferOutput, safeParseAsync } from 'valibot'

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

  errors$ = new BehaviorSubject<Record<string, { error: string }> | null>(null)
  formIsSubmitted = signal(false)

  ngAfterViewInit(): void {
    this.validateOnFormValueChanges()
    this.handleNgSubmit()
  }

  private validateOnFormValueChanges() {
    const valueChanges$ = this.ngForm.valueChanges

    if (!valueChanges$) {
      throw new Error("[formSchema] Expect NgForm's valueChanges to be present.")
    }

    valueChanges$
      .pipe(
        switchMap(() => safeParseAsync(this.formSchema(), this.ngForm.value)),
        tap(result => this.#reportUnknownIssues(result.issues)),
        tap(result => this.#reportKnownIssues(result.issues)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  private handleNgSubmit() {
    this.ngForm.ngSubmit
      .pipe(
        tap(async () => await this.#tryEmitSafeSubmit()),
        tap(() => this.#indicateFormIsSubmitted()),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  async #tryEmitSafeSubmit() {
    const result = await safeParseAsync(this.formSchema(), this.ngForm.value)

    if (!result.success) {
      return
    }

    this.safeSubmit.emit(result.output)
  }

  #indicateFormIsSubmitted() {
    this.formIsSubmitted.set(true)
  }

  // async #validate(): Promise<Record<string, { error: string }> | null> {
  //   const result = await safeParseAsync(this.formSchema(), this.ngForm.value)
  //
  //   if (result.success) {
  //     return null
  //   }
  //
  //   const unknownIssues = result.issues.filter(this.#isUnknownIssue)
  //   this.#reportUnknownIssues(unknownIssues)
  //
  //   const knownIssues = result.issues.filter(this.#isKnownIssue)
  //
  //   return knownIssues.reduce((record, issue) => {
  //     const path = issue.path?.map((segment: any) => segment.key).join('.')
  //
  //     if (!path) return record
  //
  //     return Object.assign(record, { [path]: { error: issue.message } })
  //   }, {})
  // }

  #reportUnknownIssues(issues: BaseIssue<any>[] = []) {
    const unknownIssues = issues.filter(issue => this.#isUnknownIssue(issue))

    for (const unknownIssue of unknownIssues) {
      console.error(
        `[formSchema]: Unknown NgControl detected: "${(unknownIssue.path || [])
          .map(segment => segment.key)
          .join(' ~> ')}"`
      )
    }
  }

  #reportKnownIssues(issues: BaseIssue<any>[] = []) {
    const issueMap = issues
      .filter(issue => this.#isKnownIssue(issue))
      .reduce((record, issue) => {
        const path = issue.path?.map((segment: any) => segment.key).join('.')

        if (!path) return record

        return Object.assign(record, { [path]: { error: issue.message } })
      }, {})

    this.errors$.next(issueMap)
  }

  #isKnownIssue(issue: BaseIssue<any>) {
    return !this.#isUnknownIssue(issue)
  }

  #isUnknownIssue(issue: BaseIssue<any>): boolean {
    return (
      issue.type === 'strict_object' &&
      issue.message.includes('Invalid type: Expected never but received')
    )
  }
}
