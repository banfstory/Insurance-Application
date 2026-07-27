import { Button } from '../ui/Button'
import { useQuoteWizard } from '../../context/QuoteContext'

interface StepNavProps {
  onNext?: () => boolean | void
  nextLabel?: string
  showBack?: boolean
  nextDisabled?: boolean
}

export function StepNav({
  onNext,
  nextLabel = 'Continue',
  showBack = true,
  nextDisabled = false,
}: StepNavProps) {
  const { goBack, goNext, isFirstStep, stepId } = useQuoteWizard()

  const handleNext = () => {
    if (onNext) {
      const ok = onNext()
      if (ok === false) return
    }
    goNext()
  }

  if (stepId === 'confirmation') return null

  return (
    <>
      {showBack && !isFirstStep ? (
        <Button trackingName="back" variant="secondary" onClick={goBack} className="sm:mr-auto">
          Back
        </Button>
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}
      <Button
        trackingName="next"
        onClick={handleNext}
        disabled={nextDisabled}
        className="sm:ml-auto"
      >
        {nextLabel}
      </Button>
    </>
  )
}
