import { JsonPipe } from '@angular/common'
import { Component, signal } from '@angular/core'
import { Control, form } from '@angular/forms/signals'

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
        </fieldset>
        <fieldset>
          <label class="block text-sm font-medium mb-1">Confirmed Email</label>
          <input
            type="email"
            class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [control]="registrationForm.confirmedEmail"
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
    confirmedEmail: ''
  })

  protected registrationForm = form(this.registrationModel)
}
