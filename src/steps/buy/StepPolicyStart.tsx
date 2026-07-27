import { useQuoteWizard } from '../../context/QuoteContext'
import { formatAud } from '../../utils/pricing'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { StepNav } from '../../components/layout/StepNav'
import { FormField } from '../../components/ui/FormField'

function minStartDate(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function maxStartDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

export function StepPolicyStart() {
  const { form, updateSection, quote } = useQuoteWizard()
  const { buy } = form

  const validate = () => {
    if (!buy.policyStartDate) {
      alert('Please choose a policy start date.')
      return false
    }
    if (!buy.firstName.trim() || !buy.lastName.trim()) {
      alert('Please enter your name.')
      return false
    }
    if (!buy.email.includes('@')) {
      alert('Please enter a valid email.')
      return false
    }
    return true
  }

  return (
    <WizardLayout
      title="Policy details"
      subtitle="Confirm when cover should start and how we can reach you."
      footer={<StepNav nextLabel="Proceed to payment" onNext={validate} />}
    >
      <div className="space-y-6">
        <FormField
          label="Policy start date"
          name="policyStartDate"
          type="date"
          min={minStartDate()}
          max={maxStartDate()}
          value={buy.policyStartDate}
          onChange={(e) =>
            updateSection('buy', { policyStartDate: e.target.value })
          }
          hint="Cover can start today or up to 30 days ahead"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            value={buy.firstName}
            onChange={(e) =>
              updateSection('buy', { firstName: e.target.value })
            }
          />
          <FormField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            value={buy.lastName}
            onChange={(e) =>
              updateSection('buy', { lastName: e.target.value })
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={buy.email}
            onChange={(e) => updateSection('buy', { email: e.target.value })}
          />
          <FormField
            label="Mobile"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="04xx xxx xxx"
            value={buy.phone}
            onChange={(e) => updateSection('buy', { phone: e.target.value })}
          />
        </div>

        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Amount due today</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatAud(quote.annualTotal)} (annual)
          </p>
          <p className="mt-1 text-xs">
            Mock payment only — no card will be charged in this prototype.
          </p>
        </div>
      </div>
    </WizardLayout>
  )
}
