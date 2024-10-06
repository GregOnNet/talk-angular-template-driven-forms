export interface ICheckEmailAddressAvailability {
  check(candidate: unknown): Promise<boolean>
}
