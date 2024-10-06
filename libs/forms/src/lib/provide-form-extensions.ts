import { NgModelGroupErrorSubscriberDirective } from './ng-model-group-error-subscriber.directive'
import { NgModelErrorSubscriberDirective } from './ng-model-error-subscriber.directive'
import { FormSettingDirective } from './form-setting.directive'
import { MatErrorComponent } from './mat-error.component'
import { MatFormFieldDirective } from './mat-form-field.directive'
import { FormsModule } from '@angular/forms'

export function provideFormsSetting() {
  return [
    FormsModule,
    FormSettingDirective,
    NgModelErrorSubscriberDirective,
    NgModelGroupErrorSubscriberDirective,

    // Material
    MatFormFieldDirective,
    MatErrorComponent
  ]
}
