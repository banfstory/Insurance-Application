import { useQuoteWizard } from '../../context/QuoteContext'
import type { AustralianState, ParkingType } from '../../types/quote'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { StepNav } from '../../components/layout/StepNav'
import { FormField, SelectField } from '../../components/ui/FormField'
import { RadioGroup } from '../../components/ui/RadioGroup'

const STATES: { value: AustralianState; label: string }[] = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' },
]

export function StepUsage() {
  const { form, updateSection } = useQuoteWizard()
  const { usage } = form

  const validate = () => {
    if (!usage.suburb.trim()) {
      alert('Please enter where the car is usually parked.')
      return false
    }
    return true
  }

  return (
    <WizardLayout
      title="Where is the car kept?"
      subtitle="Parking location and how far you drive affect your premium."
      footer={<StepNav onNext={validate} />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Suburb (usually parked)"
            name="suburb"
            placeholder="e.g. Parramatta"
            value={usage.suburb}
            onChange={(e) => updateSection('usage', { suburb: e.target.value })}
          />
          <SelectField
            data-tracking-name="state"
            label="State"
            name="state"
            value={usage.state}
            onChange={(e) =>
              updateSection('usage', {
                state: e.target.value as AustralianState,
              })
            }
            options={STATES.map((s) => ({ value: s.value, label: s.label }))}
          />
        </div>

        <RadioGroup<ParkingType>
          trackingName="parking-type"
          name="parkingType"
          legend="Parking type overnight"
          value={usage.parkingType}
          onChange={(parkingType) => updateSection('usage', { parkingType })}
          options={[
            {
              value: 'garage',
              label: 'Lock-up garage',
              description: 'Lowest theft risk',
            },
            {
              value: 'carport',
              label: 'Carport',
              description: 'Covered but open',
            },
            {
              value: 'driveway',
              label: 'Driveway / private property',
            },
            {
              value: 'street',
              label: 'Street parking',
              description: 'Higher premium loading',
            },
          ]}
          columns={2}
        />

        <FormField
          label="Estimated kilometres per year"
          name="annualKm"
          type="number"
          min={1000}
          max={80000}
          step={1000}
          value={usage.annualKm}
          onChange={(e) => updateSection('usage', { annualKm: e.target.value })}
          hint="Average Australian driver is about 12,000–15,000 km per year"
        />
      </div>
    </WizardLayout>
  )
}
