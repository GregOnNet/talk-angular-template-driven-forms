import { Component, inject, signal, viewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { provideFormSchema } from '@toolazon/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { type PartialDeep } from 'type-fest'
import { createRegistrationSchema, Registration } from './contracts'
import { EmailAddressAvailabilityChecker } from './email-address-availability-client.service'


@Component({
  selector: 'tz-registration',
  standalone: true,
  template: `
    <form
      [formSchema]="registrationSchema"
      (formUpdated)="registrationModel.set($event)"
      (safeSubmit)="register($event)"
      [ngFormOptions]="{ updateOn: 'blur' }"
      class="grid p-4 gap-4"
    >
      <fieldset
        class="flex flex-col gap-2"
        form-field-outlet
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
        form-field-outlet
      >
        <label for="lastname">Lastname</label>
        <input
          pInputText
          [ngModel]="registrationModel().lastname"
          name="lastname"
          id="lastname"
        />
      </fieldset>

      <div
        ngModelGroup="email"
        class="flex flex-col gap-4"
      >
        <fieldset
          class="flex flex-col gap-2"
          form-field-outlet
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
          form-field-outlet
        >
          <label for="email_verification">E-Mail verification</label>
          <input
            pInputText
            [ngModel]="registrationModel().email?.verification"
            name="verification"
            id="email_verification"
          />
        </fieldset>
        <!--        <tz-registration-email-fields [model]="registrationModel().email" />-->
      </div>

      <div class="flex gap-2 justify-end">
        <p-button
          (click)="navigateNext()"
          size="large"
          type="submit"
          label="Register"
        ></p-button>
      </div>
    </form>
  `,
  imports: [
    ButtonModule,
    InputTextModule,
    provideFormSchema(),
    ]
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
