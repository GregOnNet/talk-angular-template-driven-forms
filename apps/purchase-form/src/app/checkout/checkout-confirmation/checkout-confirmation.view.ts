import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tz-checkout-confirmation',
  standalone: true,
  template: `
    <p-button
      label="Back to overview"
      routerLink="/shopping/list"
    ></p-button>
  `,
  imports: [ButtonModule, RouterLink]
})
export default class CheckoutConfirmationView {}
