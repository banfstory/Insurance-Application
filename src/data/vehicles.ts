export const vehicleMakes = [
  'Toyota',
  'Mazda',
  'Hyundai',
  'Kia',
  'Ford',
  'Holden',
  'Mitsubishi',
  'Volkswagen',
  'Subaru',
  'Honda',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Tesla',
] as const

export const modelsByMake: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Yaris'],
  Mazda: ['Mazda3', 'CX-5', 'CX-30', 'MX-5', 'BT-50'],
  Hyundai: ['i30', 'Tucson', 'Kona', 'Santa Fe', 'Venue'],
  Kia: ['Cerato', 'Sportage', 'Seltos', 'Carnival', 'Stinger'],
  Ford: ['Ranger', 'Everest', 'Puma', 'Mustang', 'Focus'],
  Holden: ['Commodore', 'Colorado', 'Captiva', 'Trax', 'Astra'],
  Mitsubishi: ['Triton', 'Outlander', 'ASX', 'Pajero Sport', 'Eclipse Cross'],
  Volkswagen: ['Golf', 'Tiguan', 'Polo', 'Amarok', 'Passat'],
  Subaru: ['Outback', 'Forester', 'XV', 'WRX', 'Impreza'],
  Honda: ['Civic', 'CR-V', 'HR-V', 'Jazz', 'Accord'],
  Nissan: ['Navara', 'X-Trail', 'Qashqai', 'Patrol', 'Juke'],
  BMW: ['3 Series', 'X3', 'X5', '1 Series', 'i4'],
  'Mercedes-Benz': ['C-Class', 'GLC', 'A-Class', 'E-Class', 'GLE'],
  Audi: ['A3', 'Q3', 'A4', 'Q5', 'e-tron'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
}

export const currentYear = new Date().getFullYear()

export function yearOptions(count = 25): string[] {
  return Array.from({ length: count }, (_, i) => String(currentYear - i))
}
