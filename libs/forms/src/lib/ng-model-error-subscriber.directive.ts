import { AfterViewInit, DestroyRef, Directive, inject, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NgControl } from '@angular/forms'
import { tap } from 'rxjs'
import { FormSchemaDirective } from './form-schema.directive'
import { getControlPath } from './get-control-path'
import { keyof, LooseObjectSchema } from 'valibot'

@Directive({
  selector: '[ngModel]',
  standalone: true
})
export class NgModelErrorSubscriberDirective implements AfterViewInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #ngControl = inject(NgControl)
  readonly #formSchema = inject(FormSchemaDirective)

  name = input.required<NgControl['name']>()

  ngAfterViewInit(): void {
    this.#bindFormSettingErrors().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe()

    this.#ngControl
      .valueChanges!.pipe(
        tap(() => {
          const controlPathSegments = getControlPath(
            this.#formSchema.ngForm.control,
            this.#ngControl.name?.toString() || '',
            this.#ngControl.control
          ).split('.')

          const isPartOfTheSchema = this.#isControlPartOfTheSchema(
            controlPathSegments,
            this.#formSchema.formSchema() as any
          )

          if (!isPartOfTheSchema) {
            throw new Error(
              `NgControl "${controlPathSegments.join(' ~> ')}" does not match the given schema.`
            )
          }
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe()
  }

  #bindFormSettingErrors() {
    return this.#formSchema.schemaViolations$.pipe(
      tap(errors => {
        const controlPath = getControlPath(
          this.#formSchema.ngForm.control,
          this.#ngControl.name?.toString() || '',
          this.#ngControl.control
        )

        const error = errors?.[controlPath] ?? null

        if (error) this.#ngControl.control?.setErrors(error)
      })
    )
  }

  #isControlPartOfTheSchema(
    controlPathSegments: string[],
    schema: LooseObjectSchema<any, any>
  ): boolean {
    const [key, ...rest] = controlPathSegments

    try {
      const schemaPicklist = keyof(schema as any)
      const keys: string[] = schemaPicklist.options

      if (keys.includes(key) && rest.length === 0) {
        return true
      }

      if (keys.includes(key)) {
        return this.#isControlPartOfTheSchema(rest, schema.entries[key])
      }

      return false
    } catch {
      // valibots keyof throws when the schema contains a record, since the data structure defers.
      return true
    }
  }
}
