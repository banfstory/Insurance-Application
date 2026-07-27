export function generatePolicyNumber(): string {
  const prefix = 'AU'
  const segment = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()
  const digits = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}-${segment()}-${digits}`
}
