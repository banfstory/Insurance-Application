import { useQuoteWizard } from '../../context/QuoteContext'
import { formatAud } from '../../utils/pricing'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { Button } from '../../components/ui/Button'

export function StepConfirmation() {
  const { form, quote, policyNumber, resetWizard } = useQuoteWizard()
  const vehicleLabel =
    form.vehicle.identificationMode === 'registration'
      ? form.vehicle.registration
      : [form.vehicle.year, form.vehicle.make, form.vehicle.model]
          .filter(Boolean)
          .join(' ')

  return (
    <WizardLayout
      title="You’re covered"
      subtitle="Your mock policy is active in this prototype."
    >
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Policy number
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-900">
            {policyNumber ?? '—'}
          </p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Policyholder</dt>
            <dd className="font-medium text-slate-900">
              {form.buy.firstName} {form.buy.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Cover starts</dt>
            <dd className="font-medium text-slate-900">
              {form.buy.policyStartDate
                ? new Date(form.buy.policyStartDate).toLocaleDateString(
                    'en-AU',
                    { day: 'numeric', month: 'long', year: 'numeric' },
                  )
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Vehicle</dt>
            <dd className="font-medium text-slate-900">{vehicleLabel || '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Annual premium</dt>
            <dd className="font-medium text-slate-900">
              {formatAud(quote.annualTotal)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Documents</dt>
            <dd className="font-medium text-slate-900">
              Certificate of insurance sent to {form.buy.email || 'your email'}
            </dd>
          </div>
        </dl>

        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={resetWizard}
          trackingName="start-new-quote"
        >
          Start a new quote
        </Button>
      </div>
    </WizardLayout>
  )
}
