import { useQuoteWizard } from '../../context/QuoteContext'
import { formatAud } from '../../utils/pricing'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { StepNav } from '../../components/layout/StepNav'

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div
      className={`flex justify-between gap-4 text-sm ${muted ? 'text-slate-500' : 'text-slate-700'}`}
    >
      <span>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export function StepQuoteSummary() {
  const { form, quote } = useQuoteWizard()
  const vehicleLabel =
    form.vehicle.identificationMode === 'registration'
      ? form.vehicle.registration || 'Your vehicle'
      : [form.vehicle.year, form.vehicle.make, form.vehicle.model]
          .filter(Boolean)
          .join(' ') || 'Your vehicle'

  return (
    <WizardLayout
      title="Your estimated premium"
      subtitle="This is a prototype quote for demonstration only — not a real insurance offer."
      footer={<StepNav nextLabel="Continue to buy" showBack />}
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-brand-50 p-6 ring-1 ring-brand-100">
          <p className="text-sm font-medium text-brand-700">Estimated total</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
            {formatAud(quote.annualTotal)}
            <span className="text-lg font-normal text-slate-500"> / year</span>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Or about {formatAud(quote.monthlyTotal)} per month (indicative)
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Includes GST · {vehicleLabel} · {form.usage.suburb || '—'},{' '}
            {form.usage.state}
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Premium breakdown
          </p>
          <SummaryRow label="Base premium" value={formatAud(quote.basePremium)} />
          {quote.driverLoading !== 0 && (
            <SummaryRow
              label="Driver factors"
              value={formatAud(quote.driverLoading)}
            />
          )}
          {quote.usageLoading !== 0 && (
            <SummaryRow label="Usage" value={formatAud(quote.usageLoading)} />
          )}
          {quote.parkingAdjustment !== 0 && (
            <SummaryRow
              label="Parking adjustment"
              value={formatAud(quote.parkingAdjustment)}
            />
          )}
          {quote.claimsLoading !== 0 && (
            <SummaryRow
              label="Claims history"
              value={formatAud(quote.claimsLoading)}
            />
          )}
          {quote.excessDiscount !== 0 && (
            <SummaryRow
              label="Excess adjustment"
              value={formatAud(quote.excessDiscount)}
            />
          )}
          {quote.addOnsTotal !== 0 && (
            <SummaryRow label="Optional extras" value={formatAud(quote.addOnsTotal)} />
          )}
          <SummaryRow label="GST (10%)" value={formatAud(quote.gst)} muted />
          <div className="border-t border-slate-200 pt-2">
            <SummaryRow
              label="Annual total"
              value={formatAud(quote.annualTotal)}
            />
          </div>
        </div>
      </div>
    </WizardLayout>
  )
}
