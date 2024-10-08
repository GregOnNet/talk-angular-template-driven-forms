import { NgModelGroupErrorSubscriberDirective } from './ng-model-group-error-subscriber.directive'
import { NgModelErrorSubscriberDirective } from './ng-model-error-subscriber.directive'
import { FormSchemaDirective } from './form-schema.directive'
import { FormsModule } from '@angular/forms'
import { FormFieldComponent } from './form-field.component'

export function provideFormSchema() {
  return [
    FormsModule,
    FormSchemaDirective,
    FormFieldComponent,
    NgModelErrorSubscriberDirective,
    NgModelGroupErrorSubscriberDirective
  ]
}
