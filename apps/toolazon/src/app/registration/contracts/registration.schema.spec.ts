import { safeParseAsync } from 'valibot'
import { expect } from '@playwright/test'
import { ICheckEmailAddressAvailability } from './index'
import { createRegistrationSchema } from './registration.schema'

describe('When the user does not provide a firstname', () => {
  it.each`
    noValue      | issueMessage
    ${null}      | ${'Please enter your firstname.'}
    ${undefined} | ${'Please enter your firstname.'}
    ${''}        | ${'Your firstname must not be empty.'}
  `(
    'yields failure "$issueMessage" when given "$noValue"',
    async ({ issueMessage, noValue }: { noValue: null | undefined | ''; issueMessage: string }) => {
      const registrationSchema = createRegistrationSchema(jest.fn() as any)
      const formValue = { firstname: noValue }

      const result = await safeParseAsync(registrationSchema, formValue)

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
      const registrationSchema = createRegistrationSchema(jest.fn() as any)

      const formValue = { firstname: 'Alan', lastname: noValue }

      const result = await safeParseAsync(registrationSchema, formValue)

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
      const emailCheckerMock = jest
        .fn()
        .mockImplementation(
          () => ({ check: () => Promise.resolve(true) } satisfies ICheckEmailAddressAvailability)
        ) as unknown as ICheckEmailAddressAvailability

      const registrationSchema = createRegistrationSchema(emailCheckerMock)

      const formValue = { firstname: 'Alan', lastname: 'Turing', email: { email: noValue } }

      const result = await safeParseAsync(registrationSchema, formValue)

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
      const emailCheckerMock: ICheckEmailAddressAvailability = {
        check: jest.fn().mockResolvedValue(true)
      }

      const registrationSchema = createRegistrationSchema(emailCheckerMock)

      const formValue = {
        firstname: 'Alan',
        lastname: 'Turing',
        email: {
          email: 'alan.turing@christopher.uk',
          verification: noValue
        }
      }

      const result = await safeParseAsync(registrationSchema, formValue)

      expect(result.success).toBeFalsy()
      expect(result.issues?.[0].message).toBe(issueMessage)
    }
  )
})

describe('When the user types a another verified email address', () => {
  it('yields failure a failure message', async () => {
    const emailCheckerMock: ICheckEmailAddressAvailability = {
      check: jest.fn().mockResolvedValue(true)
    }

    const registrationSchema = createRegistrationSchema(emailCheckerMock)

    const formValue = {
      firstname: 'Alan',
      lastname: 'Turing',
      email: {
        email: 'alan.turing@christopher.uk',
        verification: 'albert.einstein@relativity.ch'
      }
    }

    const result = await safeParseAsync(registrationSchema, formValue)

    expect(result.success).toBeFalsy()
    expect(result.issues?.[0].message).toBe('The given email addresses do not match.')
  })
})

describe('When the email address has already been taken', () => {
  it('yields failure a failure message', async () => {
    const emailCheckerMock: ICheckEmailAddressAvailability = {
      check: jest.fn().mockResolvedValue(false)
    }
    const registrationSchema = createRegistrationSchema(emailCheckerMock)

    const formValue = {
      firstname: 'Alan',
      lastname: 'Turing',
      email: {
        email: 'taken.email@address.com'
      }
    }

    const result = await safeParseAsync(registrationSchema, formValue)

    expect(result.success).toBeFalsy()
    expect(result.issues?.[0].message).toBe('The email address has already been taken.')
  })
})

describe('When an unknown field is parsed', () => {
  it('yields failure a failure message', async () => {
    const emailCheckerMock: ICheckEmailAddressAvailability = {
      check: jest.fn().mockResolvedValue(true)
    }
    const registrationSchema = createRegistrationSchema(emailCheckerMock)

    const formValue = {
      firstname: 'Alan',
      lastname: 'Turing',
      email: {
        email: 'alan.turing@cristopher.uk',
        verification: 'alan.turing@cristopher.uk',
        I_DO_NOT_BELONG_HERE: true
      }
    }

    const result = await safeParseAsync(registrationSchema, formValue)

    expect(result.success).toBeFalsy()
  })
})
