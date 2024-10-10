import { Component, input } from '@angular/core'
import { ngFormBridge, provideFormSchema } from '@toolazon/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PartialDeep } from 'type-fest'
import { Registration } from './contracts'

@Component({
  selector: 'tz-registration-email-fields',
  standalone: true,
  template: `
    <fieldset
      class="flex flex-col gap-2"
      form-field-outlet
    >
      <label for="email">E-Mail</label>
      <input
        pInputText
        [ngModel]="model()?.email"
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
        [ngModel]="model()?.verification"
        name="verification"
        id="email_verification"
      />
    </fieldset>
  `,
  imports: [InputTextModule, provideFormSchema()],
  viewProviders: [ngFormBridge]
})
export class RegistrationEmailFieldsComponent {
  model = input<PartialDeep<Registration['email'] | undefined>>()
}
