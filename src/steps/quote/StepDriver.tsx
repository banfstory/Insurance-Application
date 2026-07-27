import { useQuoteWizard } from '../../context/QuoteContext'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { StepNav } from '../../components/layout/StepNav'
import { FormField, SelectField } from '../../components/ui/FormField'

export function StepDriver() {
  const { form, updateSection } = useQuoteWizard()
  const { driver } = form

  const validate = () => {
    const age = Number(driver.age)
    const licensed = Number(driver.yearsLicensed)
    if (!age || age < 17 || age > 99) {
      alert('Please enter a valid driver age (17–99).')
      return false
    }
    if (licensed === undefined || licensed < 0) {
      alert('Please enter years licensed.')
      return false
    }
    return true
  }

  return (
    <WizardLayout
      title="Main driver details"
      subtitle="We quote for the primary driver listed on the policy."
      footer={<StepNav onNext={validate} />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Driver age"
            name="age"
            type="number"
            min={17}
            max={99}
            placeholder="e.g. 32"
            value={driver.age}
            onChange={(e) => updateSection('driver', { age: e.target.value })}
          />
          <FormField
            label="Years holding a full licence"
            name="yearsLicensed"
            type="number"
            min={0}
            max={60}
            placeholder="e.g. 10"
            value={driver.yearsLicensed}
            onChange={(e) =>
              updateSection('driver', { yearsLicensed: e.target.value })
            }
          />
        </div>

        <SelectField
          data-tracking-name="fault-claims"
          label="At-fault claims in the last 3 years"
          name="atFaultClaims3Years"
          value={driver.atFaultClaims3Years}
          onChange={(e) =>
            updateSection('driver', { atFaultClaims3Years: e.target.value })
          }
          options={[
            { value: '0', label: 'None' },
            { value: '1', label: '1 claim' },
            { value: '2', label: '2 claims' },
            { value: '3', label: '3 or more' },
          ]}
          hint="Includes any claim where you were at fault or could not identify the other party"
        />
      </div>
    </WizardLayout>
  )
}
