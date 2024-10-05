import {
  customAsync,
  email,
  forwardAsync,
  nonEmpty,
  objectAsync,
  partialCheckAsync,
  pipe,
  pipeAsync,
  safeParseAsync,
  string
} from 'valibot'
import { expect } from '@playwright/test'

function isEmailFree(input: unknown): Promise<boolean> {
  if (typeof input !== 'string') {
    return Promise.resolve(false)
  }

  if (input === 'taken.email@address.com') {
    return Promise.resolve(false)
  }

  return Promise.resolve(true)
}

const EmailVerificationSchema = pipeAsync(
  objectAsync({
    value: pipeAsync(
      string('Please enter your email address.'),
      nonEmpty('Your email address must not be empty.'),
      email('Please enter a valid email address (e.g me@example.com).'),
      customAsync(input => isEmailFree(input), 'The email address has already been taken.')
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

const RegistrationSchema = objectAsync({
  firstname: pipe(
    string('Please enter your firstname.'),
    nonEmpty('Your firstname must not be empty.')
  ),
  lastname: pipe(
    string('Please enter your lastname.'),
    nonEmpty('Your lastname must not be empty.')
  ),
  email: EmailVerificationSchema
})

describe('When the user does not provide a firstname', () => {
  it.each`
    noValue      | issueMessage
    ${null}      | ${'Please enter your firstname.'}
    ${undefined} | ${'Please enter your firstname.'}
    ${''}        | ${'Your firstname must not be empty.'}
  `(
    'yields failure "$issueMessage" when given "$noValue"',
    async ({ issueMessage, noValue }: { noValue: null | undefined | ''; issueMessage: string }) => {
      const formValue = { firstname: noValue }

      const result = await safeParseAsync(RegistrationSchema, formValue)

      expect(result.success).toBeFalsy()
      expect(result.issues?.[0].message).toBe(issueMessage)
    }
  )
})

describe('When the user does not provide a lastname', () => {
  it.each`
    noValue      | issueMessage
    ${null}      | ${'Please enter your lastname.'}
    ${undefined} | ${'Please enter your lastname.'}
    ${''}        | ${'Your lastname must not be empty.'}
  `(
    'yields failure "$issueMessage" when given "$noValue"',
    async ({ issueMessage, noValue }: { noValue: null | undefined | ''; issueMessage: string }) => {
      const formValue = { firstname: 'Alan', lastname: noValue }

      const result = await safeParseAsync(RegistrationSchema, formValue)

      expect(result.success).toBeFalsy()
      expect(result.issues?.[0].message).toBe(issueMessage)
    }
  )
})

describe('When the user does not provide a valid email address', () => {
  it.each`
    noValue               | issueMessage
    ${null}               | ${'Please enter your email address.'}
    ${undefined}          | ${'Please enter your email address.'}
    ${''}                 | ${'Your email address must not be empty.'}
    ${'missing.domain'}   | ${'Please enter a valid email address (e.g me@example.com).'}
    ${'@domain-only.com'} | ${'Please enter a valid email address (e.g me@example.com).'}
  `(
    'yields failure "$issueMessage" when given "$noValue"',
    async ({ issueMessage, noValue }: { noValue: null | undefined | ''; issueMessage: string }) => {
      const formValue = { firstname: 'Alan', lastname: 'Turing', email: { value: noValue } }

      const result = await safeParseAsync(RegistrationSchema, formValue)

      expect(result.success).toBeFalsy()
      expect(result.issues?.[0].message).toBe(issueMessage)
    }
  )
})

describe('When the user does not provide the email address verification', () => {
  it.each`
    noValue      | issueMessage
    ${null}      | ${'Please verify your email address.'}
    ${undefined} | ${'Please verify your email address.'}
    ${''}        | ${'Please verify your email address.'}
  `(
    'yields failure "$issueMessage" when given "$noValue"',
    async ({ issueMessage, noValue }: { noValue: null | undefined | ''; issueMessage: string }) => {
      const formValue = {
        firstname: 'Alan',
        lastname: 'Turing',
        email: {
          value: 'alan.turing@christopher.uk',
          verification: noValue
        }
      }

      const result = await safeParseAsync(RegistrationSchema, formValue)

      expect(result.success).toBeFalsy()
      expect(result.issues?.[0].message).toBe(issueMessage)
    }
  )
})

describe('When the user types a another verified email address', () => {
  it('yields failure a failure message', async () => {
    const formValue = {
      firstname: 'Alan',
      lastname: 'Turing',
      email: {
        value: 'alan.turing@christopher.uk',
        verification: 'albert.einstein@relativity.ch'
      }
    }

    const result = await safeParseAsync(RegistrationSchema, formValue)

    expect(result.success).toBeFalsy()
    expect(result.issues?.[0].message).toBe('The given email addresses do not match.')
  })
})

describe('When the email address has already been taken', () => {
  it('yields failure a failure message', async () => {
    const formValue = {
      firstname: 'Alan',
      lastname: 'Turing',
      email: {
        value: 'taken.email@address.com'
      }
    }

    const result = await safeParseAsync(RegistrationSchema, formValue)

    expect(result.success).toBeFalsy()
    expect(result.issues?.[0].message).toBe('The email address has already been taken.')
  })
})
