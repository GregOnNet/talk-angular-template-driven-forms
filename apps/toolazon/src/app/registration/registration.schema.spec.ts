import { nonEmpty, objectAsync, pipe, safeParseAsync, string } from 'valibot'
import { expect } from '@playwright/test'

const RegistrationSchema = objectAsync({
  firstname: pipe(string('Please enter your firstname.'), nonEmpty('Your name must not be empty.'))
})

describe('When the user types no firstname', () => {
  it('yields an error', async () => {
    const input = {}

    const result = await safeParseAsync(RegistrationSchema, input)

    expect(result.success).toBeFalsy()
    expect(result.issues?.[0].message).toBe('Please enter your firstname.')
  })
})

describe('When the user types an empty firstname', () => {
  it('yields an error', async () => {
    const input = { firstname: '' }

    const result = await safeParseAsync(RegistrationSchema, input)

    expect(result.success).toBeFalsy()
    expect(result.issues?.[0].message).toBe('Your name must not be empty.')
  })
})
