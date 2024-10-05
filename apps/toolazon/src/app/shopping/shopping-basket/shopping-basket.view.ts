import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tz-basket',
  standalone: true,
  template: `
    <p-button
      label="Proceed to checkout"
      routerLink="/checkout/summary"
    ></p-button>
  `,
  imports: [ButtonModule, RouterLink]
})
export default class ShoppingBasketView {}
