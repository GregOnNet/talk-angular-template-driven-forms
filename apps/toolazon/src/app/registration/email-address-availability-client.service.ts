import { Injectable } from '@angular/core'
import { ICheckEmailAddressAvailability } from './contracts'

/*
 *
 * This service is used for demonstration.
 * The purpose is to show that valibot-schemas can be combined with Angular IoC container to
 * execute asynchronous validations.
 *
 */
@Injectable({ providedIn: 'root' })
export class EmailAddressAvailabilityChecker implements ICheckEmailAddressAvailability {
  /*
   * Yields true if the given email address is available, otherwise false.
   */
  check(candidate: unknown): Promise<boolean> {
    if (typeof candidate !== 'string') {
      return Promise.resolve(false)
    }

    if (candidate === 'taken.email@address.com') {
      return Promise.resolve(false)
    }

    return Promise.resolve(true)
  }
}
