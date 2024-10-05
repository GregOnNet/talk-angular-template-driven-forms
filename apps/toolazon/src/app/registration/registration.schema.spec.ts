import { nonEmpty, objectAsync, pipe, safeParseAsync, string } from 'valibot'
import { expect } from '@playwright/test'

const RegistrationSchema = objectAsync({
  firstname: pipe(string('Please enter your firstname.'), nonEmpty('Your name must not be empty.'))
})

describe('When the user does not provide a firstname', () => {
  it.each`
    noFirstname  | issueMessage
    ${null}      | ${'Please enter your firstname.'}
    ${undefined} | ${'Please enter your firstname.'}
    ${''}        | ${'Your name must not be empty.'}
  `(
    'yields failure "$issueMessage" when given "$noFirstname"',
    async ({
      issueMessage,
      noFirstname
    }: {
      noFirstname: null | undefined | ''
      issueMessage: string
    }) => {
      const formValue = { firstname: noFirstname }

      const result = await safeParseAsync(RegistrationSchema, formValue)

      expect(result.success).toBeFalsy()
      expect(result.issues?.[0].message).toBe(issueMessage)
    }
  )
})
