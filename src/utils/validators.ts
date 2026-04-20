export function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value)
}
