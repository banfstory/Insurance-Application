import { ALL_STEPS, useQuoteWizard, QUOTE_STEPS } from '../../context/QuoteContext'
import type { WizardStepId } from '../../types/quote'

const STEP_SHORT: Record<WizardStepId, string> = {
  vehicle: 'Car',
  usage: 'Usage',
  driver: 'Driver',
  cover: 'Cover',
  'quote-summary': 'Quote',
  'policy-start': 'Policy',
  payment: 'Pay',
  confirmation: 'Done',
}

export function StepIndicator() {
  const { stepIndex, stepId, phase } = useQuoteWizard()

  const visibleSteps =
    phase === 'quote' ? QUOTE_STEPS : ALL_STEPS.slice(QUOTE_STEPS.length - 1)

  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">
        {phase === 'quote' ? 'Get a quote' : 'Buy your policy'}
      </p>
      <ol className="flex flex-wrap gap-2">
        {visibleSteps.map((id) => {
          const globalIdx = ALL_STEPS.indexOf(id)
          const isActive = id === stepId
          const isComplete = globalIdx < stepIndex
          return (
            <li
              key={id}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : isComplete
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              {STEP_SHORT[id]}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
