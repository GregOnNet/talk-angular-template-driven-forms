import {
  check,
  InferOutput,
  minValue,
  nullable,
  number,
  objectAsync,
  pipe,
  record,
  string
} from 'valibot'

function sum(amounts: Record<string, number>): number {
  return Object.values(amounts).reduce((total, amount) => total + amount, 0)
}

export const ShoppingListSchema = objectAsync({
  products: pipe(
    record(string(), pipe(nullable(number(), 0), minValue(0, 'Funny, a negative amount.'))),
    check(amounts => sum(amounts) > 0, 'Please choose at least one product.')
  )
})

export type ShoppingList = InferOutput<typeof ShoppingListSchema>
