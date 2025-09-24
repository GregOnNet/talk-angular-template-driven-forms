import { JsonPipe } from '@angular/common'
import { Component, signal } from '@angular/core'
import { applyEach, Control, form, hidden, min, validate } from '@angular/forms/signals'
import confetti from 'canvas-confetti'

@Component({
  selector: 'tz-shopping-list',
  standalone: true,
  imports: [Control, JsonPipe],
  template: `
    <div class="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Shopping List</h1>

      <form class="space-y-4">
        @if(shoppingForm.items().touched()) { @for(error of shoppingForm.items().errors(); track
        error.kind) {
        <span class="text-red-500 rounded mb-4">
          {{ error.message }}
        </span>
        } } @for(item of shoppingForm.items; track item.id();let index =$index) {
        <fieldset>
          <label class="block text-sm font-medium mb-1">{{ item.name().value() }}</label>
          <input
            type="number"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="item.quantity"
          />
          @for(error of item.quantity().errors(); track error.kind) {
          <span class="text-red-500 rounded mb-4">
            {{ error.message }}
          </span>
          }
        </fieldset>
        } @if(shoppingForm.vipProduct().hidden()) {
        <div class="text-gray-500 text-sm p-3 bg-gray-50 rounded">
          Add at least 2 items to get a VIP product
        </div>
        } @else {
        <fieldset>
          <label class="block text-sm font-medium mb-1"
            >{{ shoppingForm.vipProduct().value().name }} (VIP)</label
          >
          <input
            type="number"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="shoppingForm.vipProduct.quantity"
          />
        </fieldset>
        }

        <button
          type="button"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          [disabled]="shoppingForm().submitting() || shoppingForm().invalid()"
          (click)="submitShoppingList()"
        >
          Buy now
        </button>
      </form>

      <pre class="mt-6 p-3 bg-gray-100 rounded text-xs overflow-auto">{{
        shoppingForm().value() | json
      }}</pre>

      <pre
        class="mt-6 p-3 bg-gray-100 rounded text-xs overflow-auto"
      ><code>Form Valid: {{ shoppingForm().valid() ? '✅' : '❌' }}
Form Touched: {{ shoppingForm().touched() ? '✅' : '❌' }}
Form Submitting: {{ shoppingForm().submitting() ? '⌛' : '' }}</code></pre>
    </div>
  `
})
export class ShoppingListViewComponent {
  protected shoppingModel = signal({
    items: [
      { id: crypto.randomUUID(), name: 'Screw', thumbnail: '🪛', quantity: 0 },
      { id: crypto.randomUUID(), name: 'Saw', thumbnail: '🪚', quantity: 0 },
      { id: crypto.randomUUID(), name: 'Hammer', thumbnail: '🔨', quantity: 0 },
      { id: crypto.randomUUID(), name: 'Axe', thumbnail: '🪓', quantity: 0 }
    ],
    vipProduct: {
      id: crypto.randomUUID(),
      name: 'Paper clip',
      thumbnail: '🔗',
      quantity: 0
    }
  })

  protected shoppingForm = form(this.shoppingModel, path => {
    validate(path.items, ({ valueOf }) => {
      const itemsQuantity = valueOf(path.items).reduce((total, item) => total + item.quantity, 0)
      const vipProductQuantity = valueOf(path.vipProduct.quantity)

      return itemsQuantity + vipProductQuantity > 0
        ? null
        : ({
            kind: 'items',
            message: 'Please add at least one item to the shopping list'
          } as any)
    })

    applyEach(path.items, path => {
      min(path.quantity, 0, { message: 'Quantity must be greater than 0' })
    })

    hidden(path.vipProduct, ({ valueOf }) => {
      const totalQuantity = valueOf(path.items).reduce((total, item) => total + item.quantity, 0)
      return totalQuantity < 2
    })
  })

  submitShoppingList() {
    this.#fireConfetti(0.25, {
      spread: 26,
      startVelocity: 55
    })
    this.#fireConfetti(0.2, {
      spread: 60
    })
    this.#fireConfetti(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    this.#fireConfetti(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    this.#fireConfetti(0.1, {
      spread: 120,
      startVelocity: 45
    })
  }

  #fireConfetti(
    particleRatio: number,
    config: Partial<{ spread: number; startVelocity: number; decay: number; scalar: number }>
  ) {
    const count = 200
    const defaults = { origin: { y: 0.7 } }

    confetti(
      Object.assign({}, defaults, config, {
        particleCount: Math.floor(count * particleRatio)
      })
    )
  }
}
