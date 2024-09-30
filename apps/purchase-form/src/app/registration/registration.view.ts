import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'tz-registration',
  standalone: true,
  template: `
    <p-button
      label="Register"
      routerLink="/shopping/list"
    ></p-button>
  `,
  imports: [ButtonModule, RouterLink]
})
export default class RegistrationView {}
