import { modelsByMake, vehicleMakes, yearOptions } from '../../data/vehicles'
import { useQuoteWizard } from '../../context/QuoteContext'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { StepNav } from '../../components/layout/StepNav'
import { FormField, SelectField } from '../../components/ui/FormField'
import { RadioGroup } from '../../components/ui/RadioGroup'

export function StepVehicle() {
  const { form, updateSection } = useQuoteWizard()
  const { vehicle } = form
  const models = vehicle.make ? (modelsByMake[vehicle.make] ?? []) : []

  const validate = (): boolean => {
    if (vehicle.identificationMode === 'registration') {
      return vehicle.registration.trim().length >= 2
    }
    return (
      !!vehicle.make &&
      !!vehicle.model &&
      !!vehicle.year
    )
  }

  return (
    <WizardLayout
      title="Tell us about your car"
      subtitle="We use this to estimate repair costs and theft risk for your quote."
      footer={
        <StepNav
          onNext={() => {
            if (!validate()) {
              alert('Please complete vehicle details.')
              return false
            }
          }}
        />
      }
    >
      <div className="space-y-6">
        <RadioGroup
          trackingName="identify-mode"
          name="identificationMode"
          legend="How would you like to identify your vehicle?"
          value={vehicle.identificationMode}
          onChange={(identificationMode) =>
            updateSection('vehicle', { identificationMode })
          }
          options={[
            {
              value: 'registration',
              label: 'Registration plate',
              description: 'Fastest — typical for Australian plates',
            },
            {
              value: 'manual',
              label: 'Make, model & year',
              description: 'If you do not have the rego handy',
            },
          ]}
        />

        {vehicle.identificationMode === 'registration' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              trackingName="registration"
              label="Registration number"
              name="registration"
              placeholder="e.g. ABC123"
              value={vehicle.registration}
              onChange={(e) =>
                updateSection('vehicle', {
                  registration: e.target.value.toUpperCase(),
                })
              }
              hint="As shown on your number plate"
            />
            <FormField
              trackingName="vin"
              label="VIN (optional)"
              name="vin"
              placeholder="17-character VIN"
              value={vehicle.vin}
              maxLength={17}
              onChange={(e) =>
                updateSection('vehicle', { vin: e.target.value.toUpperCase() })
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField
              trackingName="make"
              label="Make"
              name="make"
              value={vehicle.make}
              onChange={(e) =>
                updateSection('vehicle', {
                  make: e.target.value,
                  model: '',
                })
              }
              options={[
                { value: '', label: 'Select make' },
                ...vehicleMakes.map((m) => ({ value: m, label: m })),
              ]}
            />
            <SelectField
              trackingName="model"
              label="Model"
              name="model"
              value={vehicle.model}
              disabled={!vehicle.make}
              onChange={(e) => updateSection('vehicle', { model: e.target.value })}
              options={[
                { value: '', label: 'Select model' },
                ...models.map((m) => ({ value: m, label: m })),
              ]}
            />
            <SelectField
              trackingName="year"
              label="Year"
              name="year"
              value={vehicle.year}
              onChange={(e) => updateSection('vehicle', { year: e.target.value })}
              options={[
                { value: '', label: 'Year' },
                ...yearOptions().map((y) => ({ value: y, label: y })),
              ]}
            />
          </div>
        )}

        <RadioGroup
          trackingName="finance=status"
          name="financeStatus"
          legend="Is the vehicle financed or leased?"
          value={vehicle.financeStatus}
          onChange={(financeStatus) => updateSection('vehicle', { financeStatus })}
          options={[
            { value: 'owned', label: 'Owned outright' },
            { value: 'financed', label: 'Under finance' },
            { value: 'leased', label: 'Leased' },
          ]}
          columns={2}
        />

        <SelectField
          trackingName="current-insurance"
          label="Current car insurance"
          name="currentInsurance"
          value={vehicle.currentInsurance}
          onChange={(e) =>
            updateSection('vehicle', {
              currentInsurance: e.target.value as typeof vehicle.currentInsurance,
            })
          }
          options={[
            { value: 'none', label: 'No current policy' },
            { value: 'switching', label: 'Switching from another insurer' },
            { value: 'expired', label: 'Previous policy expired' },
          ]}
        />
      </div>
    </WizardLayout>
  )
}
