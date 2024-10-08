import { Component, inject, signal, viewChild } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { Router, RouterLink } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'
import { PartialDeep } from 'type-fest'
import { EmailAddressAvailabilityChecker } from './email-address-availability-client.service'
import { provideFormSchema } from '@toolazon/forms'
import { createRegistrationSchema, Registration } from './registration.schema'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'tz-registration',
  standalone: true,
  template: `
    <form
      #form="ngForm"
      [formSchema]="registrationSchema"
      (valueChanged)="registrationModel.set($event)"
      (safeSubmit)="register($event)"
      [ngFormOptions]="{ updateOn: 'blur' }"
      class="grid p-4 gap-4"
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

        <fieldset
          class="flex flex-col gap-2"
          control-wrapper
        >
          <label for="email_verification">E-Mail verification</label>
          <input
            pInputText
            [ngModel]="registrationModel().email?.verification"
            name="verification_???"
            id="email_verification"
          />
        </fieldset>
      </div>

      <div class="flex gap-2 justify-end">
        <p-button
          tabindex="1"
          (click)="form.reset()"
          severity="secondary"
          label="Reset"
        ></p-button>

        <p-button
          (click)="navigateNext()"
          type="submit"
          label="Register"
        ></p-button>
      </div>
    </form>
  `,
  imports: [ButtonModule, RouterLink, InputTextModule, provideFormSchema()]
})
export default class RegistrationView {
  #router = inject(Router)
  #emailAddressChecker = inject(EmailAddressAvailabilityChecker)

  protected form = viewChild.required(NgForm)
  protected registrationSchema = createRegistrationSchema(this.#emailAddressChecker)
  protected registrationModel = signal<PartialDeep<Registration>>({})

  register(registration: Registration) {
    console.log(registration)
  }

  async navigateNext() {
    if (this.form().invalid) {
      return
    }

    await this.#router.navigate(['/', 'shopping', 'list'])
  }
}
