import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tz-shopping-list',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  template: `
    <p-button
      label="View basket"
      routerLink="/shopping/basket"
    ></p-button>
  `
})
export default class ShoppingListView {}
