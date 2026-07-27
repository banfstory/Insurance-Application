export type AustralianState =
  | 'NSW'
  | 'VIC'
  | 'QLD'
  | 'SA'
  | 'WA'
  | 'TAS'
  | 'NT'
  | 'ACT'

export type ParkingType = 'garage' | 'carport' | 'street' | 'driveway'

export type CoverType = 'comprehensive' | 'fire-theft' | 'third-party'

export type ValuationType = 'market' | 'agreed'

export type FinanceStatus = 'owned' | 'financed' | 'leased'

export type InsuranceStatus = 'none' | 'switching' | 'expired'

export interface QuoteFormState {
  vehicle: {
    identificationMode: 'registration' | 'manual'
    registration: string
    vin: string
    make: string
    model: string
    year: string
    financeStatus: FinanceStatus
    currentInsurance: InsuranceStatus
  }
  usage: {
    suburb: string
    state: AustralianState
    parkingType: ParkingType
    annualKm: string
  }
  driver: {
    age: string
    yearsLicensed: string
    atFaultClaims3Years: string
  }
  cover: {
    coverType: CoverType
    valuation: ValuationType
    agreedValue: string
    excess: string
    addOns: {
      windscreen: boolean
      hireCar: boolean
      roadside: boolean
    }
  }
  buy: {
    policyStartDate: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  payment: {
    cardName: string
    cardNumber: string
    expiry: string
    cvv: string
  }
}

export type WizardStepId =
  | 'vehicle'
  | 'usage'
  | 'driver'
  | 'cover'
  | 'quote-summary'
  | 'policy-start'
  | 'payment'
  | 'confirmation'

export interface QuoteBreakdown {
  basePremium: number
  driverLoading: number
  usageLoading: number
  parkingAdjustment: number
  claimsLoading: number
  excessDiscount: number
  addOnsTotal: number
  gst: number
  annualTotal: number
  monthlyTotal: number
}

export const initialQuoteFormState = (): QuoteFormState => ({
  vehicle: {
    identificationMode: 'registration',
    registration: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    financeStatus: 'owned',
    currentInsurance: 'none',
  },
  usage: {
    suburb: '',
    state: 'NSW',
    parkingType: 'garage',
    annualKm: '12000',
  },
  driver: {
    age: '',
    yearsLicensed: '',
    atFaultClaims3Years: '0',
  },
  cover: {
    coverType: 'comprehensive',
    valuation: 'market',
    agreedValue: '',
    excess: '800',
    addOns: {
      windscreen: false,
      hireCar: false,
      roadside: true,
    },
  },
  buy: {
    policyStartDate: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  payment: {
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  },
})
