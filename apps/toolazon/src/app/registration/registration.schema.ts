import {
  customAsync,
  email,
  forwardAsync,
  InferOutput,
  nonEmpty,
  objectAsync,
  partialCheckAsync,
  pipe,
  pipeAsync,
  string
} from 'valibot'

import { ICheckEmailAddressAvailability } from './contracts'

/*
 *
 * Validates user information like name and email address.
 * Relies on a service (@see ICheckEmailAddressAvailability) being capable of checking the availability of the email address.
 *
 */
export function createRegistrationSchema(checker: ICheckEmailAddressAvailability) {
  return objectAsync({
    firstname: pipe(
      string('Please enter your firstname.'),
      nonEmpty('Your firstname must not be empty.')
    ),
    lastname: pipe(
      string('Please enter your lastname.'),
      nonEmpty('Your lastname must not be empty.')
    ),
    email: createEmailVerificationSchema(checker)
  })
}

export type Registration = InferOutput<ReturnType<typeof createRegistrationSchema>>

/*
 *
 * Calls the given service checking if the given email address is available.
 *
 */
function createEmailAddressAvailabilitySchema(
  emailAvailabilityChecker: ICheckEmailAddressAvailability
) {
  return pipeAsync(
    string(),
    customAsync(
      input => emailAvailabilityChecker.check(input),
      'The email address has already been taken.'
    )
  )
}

/*
 *
 * Composes multiple validations
 * 1. Checks if the given email address is valid
 * 2. Checks if the given email address is available
 * 3. Checks if the given email address has been verified by typing it a 2nd time
 *
 */
function createEmailVerificationSchema(
  emailAddressAvailabilityChecker: ICheckEmailAddressAvailability
) {
  return pipeAsync(
    objectAsync({
      value: pipeAsync(
        EmailValidationSchema,
        createEmailAddressAvailabilitySchema(emailAddressAvailabilityChecker)
      ),
      verification: pipe(
        string('Please verify your email address.'),
        nonEmpty('Please verify your email address.')
      )
    }),
    forwardAsync(
      partialCheckAsync(
        [['value'], ['verification']],
        input => input.value === input.verification,
        'The given email addresses do not match.'
      ),
      ['verification']
    )
  )
}

const EmailValidationSchema = pipe(
  string('Please enter your email address.'),
  nonEmpty('Your email address must not be empty.'),
  email('Please enter a valid email address (e.g me@example.com).')
)
