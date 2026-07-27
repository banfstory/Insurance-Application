import { useEffect, useRef } from 'react'
import { useQuoteWizard } from './context/QuoteContext'
import { StepConfirmation } from './steps/buy/StepConfirmation'
import { StepPayment } from './steps/buy/StepPayment'
import { StepPolicyStart } from './steps/buy/StepPolicyStart'
import { StepCover } from './steps/quote/StepCover'
import { StepDriver } from './steps/quote/StepDriver'
import { StepQuoteSummary } from './steps/quote/StepQuoteSummary'
import { StepUsage } from './steps/quote/StepUsage'
import { StepVehicle } from './steps/quote/StepVehicle'

const STEP_COMPONENTS = {
  vehicle: StepVehicle,
  usage: StepUsage,
  driver: StepDriver,
  cover: StepCover,
  'quote-summary': StepQuoteSummary,
  'policy-start': StepPolicyStart,
  payment: StepPayment,
  confirmation: StepConfirmation,
} as const

export function QuoteWizard() {
  const context = useQuoteWizard()
  const stepId = context?.stepId
  const previousStepRef = useRef<string | null>(null)

  useEffect(() => {
    if (!stepId) return

    // Only fire if the stepId has actually changed from the previous render
    if (previousStepRef.current === stepId) {
      return
    }

    previousStepRef.current = stepId;

    // Store stepId into window.__pageId
    (window as any).__pageId = stepId

    // Push step-view analytics to your data layer
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'pageview',
      step: stepId,
    })
  }, [stepId])

  // Safely check if stepId is valid and exists in our map
  const Step = stepId ? STEP_COMPONENTS[stepId as keyof typeof STEP_COMPONENTS] : undefined
  
  if (!Step) {
    return <div className="p-4 text-red-600">Error: Invalid or missing step ID ("{String(stepId)}")</div>
  }

  return (
    <div data-tracking-group={stepId}>
      <Step />
    </div>
  )
}