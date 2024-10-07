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
  ViewContainerRef
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { tap } from 'rxjs'
import { FormSchemaDirective } from './form-schema.directive'

@Component({
  standalone: true,

  template: '{{ text() }}'
})
export class ErrorSummaryComponent {
  text = model.required<string>()
}

@Directive({
  selector: '[ngModelGroup]',
  standalone: true
})
export class NgModelGroupErrorSubscriberDirective implements AfterViewInit, OnDestroy {
  readonly #destroyRef = inject(DestroyRef)
  readonly #viewContainerRef = inject(ViewContainerRef)

  readonly #formSetting = inject(FormSchemaDirective)

  #componentRef: ComponentRef<ErrorSummaryComponent> | undefined

  name = input('', { alias: 'ngModelGroup' })

  ngAfterViewInit(): void {
    this.#bindFormSettingErrors().pipe(takeUntilDestroyed(this.#destroyRef)).subscribe()
  }

  ngOnDestroy(): void {
    this.#componentRef?.destroy()
  }

  #bindFormSettingErrors() {
    return this.#formSetting.errors$.pipe(
      tap(errors => {
        const error = errors?.[this.name()] ?? null

        if (error) {
          this.#componentRef?.destroy() // Avoid component is rendered multiple times if error is already displayed
          this.#componentRef = this.#viewContainerRef.createComponent(ErrorSummaryComponent)
          this.#componentRef.instance.text.set(error.auto)
        } else {
          this.#componentRef?.destroy()
        }
      })
    )
  }
}
