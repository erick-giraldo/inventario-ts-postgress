export interface IMappedError {
  property: string
  errors: Array<string | IMappedError>
}