import { Component, inject, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'
import { PartialDeep } from 'type-fest'
import { EmailAddressAvailabilityChecker } from './email-address-availability-client.service'
import { provideFormSchema } from '@toolazon/forms'
import { createRegistrationSchema, Registration } from './registration.schema'

@Component({
  selector: 'tz-registration',
  standalone: true,
  template: `
    <form
      class="grid p-4 gap-4"
      [formSchema]="registrationSchema"
      (valueChanged)="registrationModel.set($event)"
      [ngFormOptions]="{ updateOn: 'blur' }"
    >
      <fieldset
        class="flex flex-col gap-2"
        control-wrapper
      >
        <label for="firstname">Firstname</label>
        <input
          pInputText
          [ngModel]="registrationModel().firstname"
          name="firstname"
          id="firstname"
        />
      </fieldset>

      <fieldset
        class="flex flex-col gap-2"
        control-wrapper
      >
        <label for="lastname">Lastname</label>
        <input
          pInputText
          [ngModel]="registrationModel().lastname"
          name="lastname"
          id="lastname"
        />
      </fieldset>

      <div ngModelGroup="email">
        <fieldset
          class="flex flex-col gap-2"
          control-wrapper
        >
          <label for="email">E-Mail</label>
          <input
            pInputText
            [ngModel]="registrationModel().email?.email"
            name="email"
            id="email"
          />
        </fieldset>

        <fieldset
          class="flex flex-col gap-2"
          control-wrapper
        >
          <label for="email_verification">E-Mail verification</label>
          <input
            pInputText
            [ngModel]="registrationModel().email?.verification"
            name="verification"
            id="email_verification"
          />
        </fieldset>
      </div>

      <p-button
        label="Register"
        routerLink="/shopping/list"
      ></p-button>
    </form>
  `,
  imports: [ButtonModule, RouterLink, InputTextModule, provideFormSchema()]
})
export default class RegistrationView {
  #emailAddressChecker = inject(EmailAddressAvailabilityChecker)

  protected registrationSchema = createRegistrationSchema(this.#emailAddressChecker)
  protected registrationModel = signal<PartialDeep<Registration>>({})
}
