import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'tz-registration',
  standalone: true,
  template: `
    <form class="grid p-4 gap-4">
      <fieldset class="flex flex-col gap-2">
        <label for="firstname">Firstname</label>
        <input
          pInputText
          id="firstname"
        />
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <label for="lastname">Lastname</label>
        <input
          pInputText
          id="lastname"
        />
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <label for="email">E-Mail</label>
        <input
          pInputText
          id="email"
        />
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <label for="email_confirmed">Confirm E-Mail</label>
        <input
          pInputText
          id="email_confirmed"
        />
      </fieldset>

      <p-button
        label="Register"
        routerLink="/shopping/list"
      ></p-button>
    </form>
  `,
  imports: [ButtonModule, RouterLink, InputTextModule]
})
export default class RegistrationView {}
