import {
  AfterViewInit,
  Component,
  ComponentRef,
  DestroyRef,
  Directive,
  inject,
  input,
  model,
  OnDestroy,
  signal,
  ViewContainerRef
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { tap } from 'rxjs'
import { FormSchemaDirective } from './form-schema.directive'
import { NgModelGroup } from '@angular/forms'

@Component({
  standalone: true,
  template: `
    @if(isVisible()) {
    <span class="text-red-500 mb-4 ">
      {{ text() }}
    </span>
    }
  `
})
export class ErrorSummaryComponent {
  isVisible = signal(false)
  text = model.required<string>()
}

@Directive({
  selector: '[ngModelGroup]',
  standalone: true
})
export class NgModelGroupErrorSubscriberDirective implements AfterViewInit, OnDestroy {
  #destroyRef = inject(DestroyRef)
  #viewContainerRef = inject(ViewContainerRef)
  #ngControl = inject(NgModelGroup)

  #formSchema = inject(FormSchemaDirective)

  #componentRef: ComponentRef<ErrorSummaryComponent> | undefined

  name = input('', { alias: 'ngModelGroup' })

  ngAfterViewInit(): void {
    this.#bindFormSettingErrors().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe()
  }

  ngOnDestroy(): void {
    this.#componentRef?.destroy()
  }

  #bindFormSettingErrors() {
    return this.#formSchema.schemaViolations$.pipe(
      tap(errors => {
        const error = errors?.[this.name()] ?? null

        if (error) {
          this.#ngControl.control?.setErrors(error)
          this.#componentRef?.destroy() // Avoid component is rendered multiple times if error is already displayed
          this.#componentRef = this.#viewContainerRef.createComponent(ErrorSummaryComponent)
          this.#componentRef.instance.isVisible = this.#formSchema.formIsSubmitted
          this.#componentRef.instance.text.set(error.schemaViolation)
        } else {
          this.#componentRef?.destroy()
        }
      })
    )
  }
}
