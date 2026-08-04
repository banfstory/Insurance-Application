import { useQuoteWizard } from '../../context/QuoteContext'
import type { CoverType, ValuationType } from '../../types/quote'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { StepNav } from '../../components/layout/StepNav'
import { FormField, SelectField } from '../../components/ui/FormField'
import { RadioGroup } from '../../components/ui/RadioGroup'

export function StepCover() {
  const { form, updateSection } = useQuoteWizard()
  const { cover } = form

  const toggleAddOn = (key: keyof typeof cover.addOns) => {
    updateSection('cover', {
      addOns: { ...cover.addOns, [key]: !cover.addOns[key] },
    })
  }

  return (
    <WizardLayout
      title="Choose your cover"
      subtitle="Select protection level, excess, and optional extras."
      footer={<StepNav nextLabel="See my quote" />}
    >
      <div className="space-y-6">
        <RadioGroup<CoverType>
          trackingName="cover-type"
          name="coverType"
          legend="Cover type"
          value={cover.coverType}
          onChange={(coverType) => updateSection('cover', { coverType })}
          options={[
            {
              value: 'comprehensive',
              label: 'Comprehensive',
              description: 'Damage to your car, others’ property, fire & theft',
            },
            {
              value: 'fire-theft',
              label: 'Third party fire & theft',
              description: 'Others’ property plus fire/theft of your car',
            },
            {
              value: 'third-party',
              label: 'Third party property only',
              description: 'Damage you cause to other people’s property',
            },
          ]}
        />

        {cover.coverType === 'comprehensive' && (
          <RadioGroup<ValuationType>
            trackingName="valuation"
            name="valuation"
            legend="Sum insured"
            value={cover.valuation}
            onChange={(valuation) => updateSection('cover', { valuation })}
            options={[
              {
                value: 'market',
                label: 'Market value',
                description: 'Payout based on value at time of loss',
              },
              {
                value: 'agreed',
                label: 'Agreed value',
                description: 'Fixed amount you agree with us upfront',
              },
            ]}
            columns={2}
          />
        )}

        {cover.coverType === 'comprehensive' &&
          cover.valuation === 'agreed' && (
            <FormField
              trackingName="agreed-value"
              label="Agreed value (AUD)"
              name="agreedValue"
              type="number"
              min={1000}
              step={500}
              placeholder="e.g. 28000"
              value={cover.agreedValue}
              onChange={(e) =>
                updateSection('cover', { agreedValue: e.target.value })
              }
            />
          )}

        <SelectField
          data-tracking-name="excess"
          label="Standard excess"
          name="excess"
          value={cover.excess}
          onChange={(e) => updateSection('cover', { excess: e.target.value })}
          options={[
            { value: '500', label: '$500 — higher premium' },
            { value: '800', label: '$800 — standard' },
            { value: '1000', label: '$1,000' },
            { value: '1500', label: '$1,500 — lower premium' },
          ]}
          hint="Amount you pay toward each claim before we cover the rest"
        />

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            Optional extras
          </legend>
          <div className="space-y-2">
            {(
              [
                ['windscreen', 'Windscreen & glass excess buy-down'],
                ['hireCar', 'Hire car after theft or accident'],
                ['roadside', '24/7 roadside assistance'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
              >
                <input
                  data-tracking-name={key}
                  data-tracking-type="checkbox"
                  type="checkbox"
                  checked={cover.addOns[key]}
                  onChange={() => toggleAddOn(key)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-slate-800">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </WizardLayout>
  )
}
