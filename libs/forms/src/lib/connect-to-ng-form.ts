import { Optional, Provider } from '@angular/core'
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms'

const controlContainerProvider: Provider = {
  provide: ControlContainer,
  useFactory(ngForm: NgForm, ngModelGroup: NgModelGroup) {
    return ngModelGroup || ngForm || null
  },
  deps: [
    [new Optional(), NgForm],
    [new Optional(), NgModelGroup]
  ]
}

export const ngFormBridge = [
  { provide: ControlContainer, useExisting: NgForm },
  controlContainerProvider // very important if we want nested components with ngModelGroup
]
