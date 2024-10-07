import { Component, forwardRef, input, signal } from '@angular/core'
import { ButtonGroupModule } from 'primeng/buttongroup'
import { ButtonModule } from 'primeng/button'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Product } from './contracts'

@Component({
  selector: 'tz-product-card',
  standalone: true,
  imports: [ButtonGroupModule, ButtonModule],
  template: `
    <div class="flex gap-4 items-center">
      <article class="grid gap-2">
        <p class="text-center text-4xl">{{ product().thumbnail }}</p>
        <small class="block text-center">{{ product().name }}</small>
      </article>
      <div class="flex gap-2 items-start">
        <span class="p-2 border border-surface rounded-md min-w-10 text-right">{{
          this.amount()
        }}</span>
        <p-buttonGroup>
          <p-button
            [disabled]="isDisabled()"
            label="-"
            (click)="decreaseAmountByOne()"
          />
          <p-button
            [disabled]="isDisabled()"
            label="+"
            (click)="increaseAmountByOne()"
          />
        </p-buttonGroup>
      </div>
    </div>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ProductCardComponent), multi: true }
  ]
})
export class ProductCardComponent implements ControlValueAccessor {
  protected isDisabled = signal(false)
  protected amount = signal(0)

  product = input.required<Product>()

  writeValue(amount?: number): void {
    this.amount.set(amount || 0)
  }
  registerOnChange(fn: any): void {
    this.#propagateChange = fn
  }
  registerOnTouched(fn: any): void {
    this.#propagateTouch = fn
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled)
  }

  protected increaseAmountByOne() {
    this.amount.update(amount => ++amount)
    this.#propagateChange(this.amount())
  }

  protected decreaseAmountByOne() {
    this.amount.update(amount => --amount)
    this.#propagateChange(this.amount())
  }

  #propagateChange = (amount: number) => {
    /* intentionally left blank */
  }
  #propagateTouch = () => {
    /* intentionally left blank */
  }
}
