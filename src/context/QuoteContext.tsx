import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  initialQuoteFormState,
  type QuoteFormState,
  type WizardStepId,
} from '../types/quote'
import type { QuoteBreakdown } from '../types/quote'
import { calculateQuote } from '../utils/pricing'

const QUOTE_STEPS: WizardStepId[] = [
  'vehicle',
  'usage',
  'driver',
  'cover',
  'quote-summary',
]

const BUY_STEPS: WizardStepId[] = ['policy-start', 'payment', 'confirmation']

export const ALL_STEPS: WizardStepId[] = [...QUOTE_STEPS, ...BUY_STEPS]

const STEP_LABELS: Record<WizardStepId, string> = {
  vehicle: 'Your car',
  usage: 'Where & how you drive',
  driver: 'Driver',
  cover: 'Cover options',
  'quote-summary': 'Your quote',
  'policy-start': 'Policy details',
  payment: 'Payment',
  confirmation: 'Confirmation',
}

interface QuoteContextValue {
  form: QuoteFormState
  updateForm: (patch: Partial<QuoteFormState>) => void
  updateSection: <K extends keyof QuoteFormState>(
    section: K,
    patch: Partial<QuoteFormState[K]>,
  ) => void
  stepIndex: number
  stepId: WizardStepId
  steps: WizardStepId[]
  phase: 'quote' | 'buy'
  goNext: () => void
  goBack: () => void
  goToStep: (id: WizardStepId) => void
  quote: QuoteBreakdown
  policyNumber: string | null
  setPolicyNumber: (value: string) => void
  resetWizard: () => void
  stepLabel: string
  isFirstStep: boolean
  isLastStep: boolean
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<QuoteFormState>(initialQuoteFormState)
  const [stepIndex, setStepIndex] = useState(0)
  const [policyNumber, setPolicyNumber] = useState<string | null>(null)

  const phase: 'quote' | 'buy' =
    stepIndex < QUOTE_STEPS.length ? 'quote' : 'buy'
  const steps = ALL_STEPS
  const stepId = steps[stepIndex]

  const updateForm = useCallback((patch: Partial<QuoteFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateSection = useCallback(
    <K extends keyof QuoteFormState>(
      section: K,
      patch: Partial<QuoteFormState[K]>,
    ) => {
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...patch },
      }))
    },
    [],
  )

  const quote = useMemo(() => calculateQuote(form), [form])

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }, [steps.length])

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0))
  }, [])

  const goToStep = useCallback((id: WizardStepId) => {
    const idx = ALL_STEPS.indexOf(id)
    if (idx >= 0) setStepIndex(idx)
  }, [])

  const resetWizard = useCallback(() => {
    setForm(initialQuoteFormState())
    setStepIndex(0)
    setPolicyNumber(null)
  }, [])

  const value: QuoteContextValue = {
    form,
    updateForm,
    updateSection,
    stepIndex,
    stepId,
    steps,
    phase,
    goNext,
    goBack,
    goToStep,
    quote,
    policyNumber,
    setPolicyNumber,
    resetWizard,
    stepLabel: STEP_LABELS[stepId],
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === steps.length - 1,
  }

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  )
}

export function useQuoteWizard(): QuoteContextValue {
  const ctx = useContext(QuoteContext)
  if (!ctx) {
    throw new Error('useQuoteWizard must be used within QuoteProvider')
  }
  return ctx
}

export { QUOTE_STEPS, BUY_STEPS, STEP_LABELS }
