import { Component, computed, inject, signal, viewChild } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { Router, RouterLink } from '@angular/router'
import { ButtonGroupModule } from 'primeng/buttongroup'
import { ProductCardComponent } from './product-card.component'
import { Product, ShoppingList, ShoppingListSchema } from './contracts'
import { provideFormSchema } from '@toolazon/forms'
import { PartialDeep } from 'type-fest'
import { JsonPipe } from '@angular/common'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'tz-shopping-list',
  standalone: true,
  template: `
    <div class="grid place-items-center">
      <form
        class="grid gap-4"
        [formSchema]="shoppingListSchema"
        (valueChanged)="shoppingListModel.set($event)"
      >
        <div ngModelGroup="products">
          @for (product of products(); track product.id) {

          <fieldset form-field>
            <tz-product-card
              [ngModel]="shoppingListModel().products?.[product.id]"
              [name]="product.id"
              [product]="product"
            />
          </fieldset>
          } @if(vm().vipProduct; as vipProduct) {
          <tz-product-card
            [ngModel]="vm().model.products?.[vipProduct.id]"
            [name]="vipProduct.id"
            [product]="vipProduct"
          />
          }
        </div>
        <p-button
          label="View basket"
          type="submit"
          (click)="tryNavigateNext()"
        ></p-button>
      </form>
    </div>
    <pre><code>{{ shoppingListModel() | json }}</code></pre>
  `,
  imports: [
    ButtonModule,
    RouterLink,
    ButtonGroupModule,
    ProductCardComponent,
    provideFormSchema(),
    JsonPipe
  ]
})
export default class ShoppingListView {
  #router = inject(Router)

  protected form = viewChild.required(NgForm)
  protected shoppingListSchema = ShoppingListSchema
  protected shoppingListModel = signal<PartialDeep<ShoppingList>>({})

  protected products = signal<Product[]>([
    { id: crypto.randomUUID(), name: 'Screw', thumbnail: '🪛' },
    { id: crypto.randomUUID(), name: 'Saw', thumbnail: '🪚' },
    { id: crypto.randomUUID(), name: 'Hammer', thumbnail: '🔨' },
    { id: crypto.randomUUID(), name: 'Axe', thumbnail: '🪓' }
  ])

  protected vipProduct = signal<Product>({
    id: crypto.randomUUID(),
    name: 'Paper clip',
    thumbnail: '🔗'
  })

  protected vm = computed(() => {
    const products = Object.values(this.shoppingListModel().products || {}).filter(
      (maybeAmount): maybeAmount is number => !!maybeAmount
    )

    const total = products.reduce((total, amount) => total + amount, 0)

    return {
      model: this.shoppingListModel(),
      vipProduct: total >= 10 ? this.vipProduct() : null
    }
  })

  async tryNavigateNext() {
    if (this.form().invalid) {
      return
    }

    await this.#router.navigate(['/', 'shopping', 'basket'])
  }
}
