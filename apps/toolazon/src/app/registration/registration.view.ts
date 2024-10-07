import { Component, inject, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'
import { PartialDeep } from 'type-fest'
import { EmailAddressAvailabilityChecker } from './email-address-availability-client.service'
import { provideFormsSetting } from '@toolazon/forms'
import { createRegistrationSchema, Registration } from './registration.schema'

@Component({
  selector: 'tz-registration',
  standalone: true,
  template: `
    <form
      class="grid p-4 gap-4"
      [formSchema]="registrationSchema"
      (valueChanged)="registrationModel.set($event)"
    >
      <fieldset class="flex flex-col gap-2">
        <label for="firstname">Firstname</label>
        <input
          pInputText
          [ngModel]="registrationModel().firstname"
          name="firstname"
          id="firstname"
        />
      </fieldset>

      <fieldset class="flex flex-col gap-2">
        <label for="lastname">Lastname</label>
        <input
          pInputText
          [ngModel]="registrationModel().lastname"
          name="lastname"
          id="lastname"
        />
      </fieldset>

      <ng-container ngModelGroup="email">
        <fieldset class="flex flex-col gap-2">
          <label for="email">E-Mail</label>
          <input
            pInputText
            [ngModel]="registrationModel().email?.value"
            name="value"
            id="email"
          />
        </fieldset>

        <fieldset class="flex flex-col gap-2">
          <label for="email_verification">E-Mail verification</label>
          <input
            pInputText
            [ngModel]="registrationModel().email?.verification"
            name="verification"
            id="email_verification"
          /></fieldset
      ></ng-container>

      <p-button
        label="Register"
        routerLink="/shopping/list"
      ></p-button>
    </form>
  `,
  imports: [ButtonModule, RouterLink, InputTextModule, provideFormsSetting()]
})
export default class RegistrationView {
  #emailAddressChecker = inject(EmailAddressAvailabilityChecker)

  protected registrationSchema = createRegistrationSchema(this.#emailAddressChecker)
  protected registrationModel = signal<PartialDeep<Registration>>({})
}
