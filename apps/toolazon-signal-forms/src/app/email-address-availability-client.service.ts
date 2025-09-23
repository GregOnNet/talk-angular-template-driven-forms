import { Injectable } from '@angular/core'
import { map, Observable, of, timer } from 'rxjs'

/*
 *
 * This service is used for demonstration.
 * The purpose is to show that valibot-schemas can be combined with Angular IoC container to
 * execute asynchronous validations.
 *
 */
@Injectable({ providedIn: 'root' })
export class EmailAddressAvailabilityChecker {
  /*
   * Yields true if the given email address is available, otherwise false.
   */
  check(candidate: unknown): Observable<boolean> {
    if (typeof candidate !== 'string') {
      return of(false)
    }

    if (candidate === 'taken.email@address.com') {
      return timer(1000).pipe(map(() => false))
    }

    return of(true)
  }
}
