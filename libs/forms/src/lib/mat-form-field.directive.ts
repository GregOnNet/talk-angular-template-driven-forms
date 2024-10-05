import { ContentChild, Directive } from '@angular/core';
import { NgModel } from '@angular/forms';

/*
 * Hooks into mat-form-field to share NgModel with NgModelErrorSubscriberDirective.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-form-field',
  standalone: true,
})
export class MatFormFieldDirective {
  @ContentChild(NgModel) public readonly ngModel: NgModel | undefined;
}
