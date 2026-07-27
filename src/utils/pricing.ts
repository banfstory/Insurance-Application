import type { QuoteBreakdown, QuoteFormState } from '../types/quote'

const COVER_BASE: Record<QuoteFormState['cover']['coverType'], number> = {
  comprehensive: 980,
  'fire-theft': 620,
  'third-party': 380,
}

const ADD_ON_PRICES = {
  windscreen: 85,
  hireCar: 120,
  roadside: 65,
}

export function calculateQuote(form: QuoteFormState): QuoteBreakdown {
  const basePremium = COVER_BASE[form.cover.coverType]

  const age = Number(form.driver.age) || 30
  let driverLoading = 0
  if (age < 25) driverLoading = basePremium * 0.35
  else if (age < 30) driverLoading = basePremium * 0.12
  else if (age >= 70) driverLoading = basePremium * 0.08

  const licensed = Number(form.driver.yearsLicensed) || 0
  if (licensed < 2) driverLoading += basePremium * 0.15

  const km = Number(form.usage.annualKm) || 12000
  let usageLoading = 0
  if (km > 25000) usageLoading = basePremium * 0.18
  else if (km > 15000) usageLoading = basePremium * 0.08

  const parkingAdj: Record<typeof form.usage.parkingType, number> = {
    garage: -basePremium * 0.05,
    carport: -basePremium * 0.02,
    driveway: 0,
    street: basePremium * 0.1,
  }
  const parkingAdjustment = parkingAdj[form.usage.parkingType]

  const claims = Number(form.driver.atFaultClaims3Years) || 0
  const claimsLoading = claims * basePremium * 0.2

  const excess = Number(form.cover.excess) || 800
  let excessDiscount = 0
  if (excess >= 1500) excessDiscount = -basePremium * 0.12
  else if (excess >= 1000) excessDiscount = -basePremium * 0.06
  else if (excess <= 500) excessDiscount = basePremium * 0.08

  if (form.vehicle.financeStatus === 'financed') {
    usageLoading += basePremium * 0.03
  }

  let addOnsTotal = 0
  if (form.cover.addOns.windscreen) addOnsTotal += ADD_ON_PRICES.windscreen
  if (form.cover.addOns.hireCar) addOnsTotal += ADD_ON_PRICES.hireCar
  if (form.cover.addOns.roadside) addOnsTotal += ADD_ON_PRICES.roadside

  const subtotal =
    basePremium +
    driverLoading +
    usageLoading +
    parkingAdjustment +
    claimsLoading +
    excessDiscount +
    addOnsTotal

  const gst = subtotal * 0.1
  const annualTotal = Math.round(subtotal + gst)
  const monthlyTotal = Math.round(annualTotal / 12)

  return {
    basePremium: Math.round(basePremium),
    driverLoading: Math.round(driverLoading),
    usageLoading: Math.round(usageLoading),
    parkingAdjustment: Math.round(parkingAdjustment),
    claimsLoading: Math.round(claimsLoading),
    excessDiscount: Math.round(excessDiscount),
    addOnsTotal: Math.round(addOnsTotal),
    gst: Math.round(gst),
    annualTotal,
    monthlyTotal,
  }
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount)
}
