import { FormsModule } from '@angular/forms'
import { FormFieldComponent } from './form-field-outlet.component'
import { FormSchemaDirective } from './form-schema.directive'
import { NgModelErrorSubscriberDirective } from './ng-model-error-subscriber.directive'
import { NgModelGroupErrorSubscriberDirective } from './ng-model-group-error-subscriber.directive'

export function provideFormSchema() {
  return [
    FormsModule,
    FormSchemaDirective,
    FormFieldComponent,
    NgModelErrorSubscriberDirective,
    NgModelGroupErrorSubscriberDirective
  ]
}
