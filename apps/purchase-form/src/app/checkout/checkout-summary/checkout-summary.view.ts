import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tz-checkout-summary',
  standalone: true,
  template: `
    <p-button
      label="Buy"
      routerLink="/checkout/confirmation"
    ></p-button>
  `,
  imports: [ButtonModule, RouterLink]
})
export default class CheckoutSummaryView {}
