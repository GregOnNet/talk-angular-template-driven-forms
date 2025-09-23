import { JsonPipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { Control, form, required, validate, validateAsync } from '@angular/forms/signals'
import { EmailAddressAvailabilityChecker } from './email-address-availability-client.service'

@Component({
  selector: 'tz-registration-view',
  template: `
    <div class="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Registration</h1>

      <form class="space-y-4">
        <fieldset>
          <label class="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="registrationForm.firstName"
          />
          @if (registrationForm.firstName().dirty()) { @for (error of
          registrationForm.firstName().errors(); track error.kind) {
          <span class="text-red-500 rounded mb-4">
            {{ error.message }}
          </span>
          } }
        </fieldset>
        <fieldset>
          <label class="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="registrationForm.lastName"
          />
        </fieldset>
        <fieldset>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="registrationForm.email"
          />
          @for (error of registrationForm.email().errors(); track error.kind) {
          <span class="text-red-500 rounded mb-4">
            {{ error.message }}
          </span>
          }
        </fieldset>
        <fieldset>
          <label class="block text-sm font-medium mb-1">Confirmed Email</label>
          <input
            type="email"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="registrationForm.confirmedEmail"
          />
          @for (error of registrationForm.confirmedEmail().errors(); track error.kind) {
          <span class="text-red-500 rounded mb-4">
            {{ error.message }}
          </span>
          }
        </fieldset>
        <fieldset>
          <label class="block text-sm font-medium mb-1">Notify by Email</label>
          <input
            type="checkbox"
            [control]="registrationForm.notifyByEmail"
          />
        </fieldset>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>

      <pre class="mt-6 p-3 bg-gray-100 rounded text-xs overflow-auto">{{
        registrationForm().value() | json
      }}</pre>
    </div>
  `,
  imports: [Control, JsonPipe]
})
export class RegistrationViewComponent {
  protected registrationModel = signal({
    firstName: '',
    lastName: '',
    email: '',
    confirmedEmail: '',
    notifyByEmail: false
  })

  protected registrationForm = form(this.registrationModel, path => {
    const emailAvailabilityChecker = inject(EmailAddressAvailabilityChecker)
    required(path.firstName, { message: 'First name is required' })
    required(path.lastName, { message: 'Last name is required' })

    required(path.email, {
      message: 'Email is required',
      when: ({ valueOf }) => valueOf(path.notifyByEmail) === true
    })

    required(path.confirmedEmail, {
      message: 'Confirmed email is required',
      when: ({ valueOf }) => valueOf(path.notifyByEmail) === true
    })

    validate(path.confirmedEmail, ctx => {
      if (ctx.value() !== ctx.valueOf(path.email)) {
        return {
          kind: 'confirmedEmail',
          message: 'Email and confirmed email do not match'
        } as any
      }

      return null
    })

    validateAsync(path.email, {
      params: ctx => ctx.value(),
      factory: params =>
        rxResource({
          params,
          stream: ({ params }) => emailAvailabilityChecker.check(params)
        }),
      errors: (isAvailable, ctx) => {
        return isAvailable
          ? null
          : {
              kind: 'email',
              message: `Email "${ctx.value()}" is not available`
            }
      }
    })
  })

  constructor() {
    // Interact with writable signal via form that syncs to model value
    this.registrationForm.firstName().value.set('Alan')
  }
}
