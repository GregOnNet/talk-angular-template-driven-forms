import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MatFormFieldDirective } from './mat-form-field.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-error',
  standalone: true,
  imports: [NgIf],
  template: ` <ng-container *ngIf="isErrorRequiredToBeDisplayed">{{ error }}</ng-container> `,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MatErrorComponent {
  protected readonly matFormField = inject(MatFormFieldDirective);

  protected get isErrorRequiredToBeDisplayed(): boolean {
    return !!this.matFormField.ngModel?.errors;
  }

  protected get error() {
    const errors = this.matFormField.ngModel?.errors;

    if (hasOwnProperty(errors, 'auto')) {
      return errors.auto;
    }

    throw new Error('Expected "suiteError", but nothing was found.');
  }
}

function hasOwnProperty<X extends object, Y extends PropertyKey>(
  candidate: X | undefined | null,
  propertyKey: Y
): candidate is X & Record<Y, unknown> {
  return !candidate ? false : Object.prototype.hasOwnProperty.call(candidate, propertyKey);
}
