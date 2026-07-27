interface RadioOption<T extends string> {
  value: T
  label: string
  description?: string
}

interface RadioGroupProps<T extends string> {
  name: string
  legend: string
  value: T
  onChange: (value: T) => void
  options: RadioOption<T>[]
  columns?: 1 | 2
  trackingName?: string
  trackingType?: string
}

export function RadioGroup<T extends string>({
  name,
  legend,
  value,
  onChange,
  options,
  columns = 1,
  trackingName,
  trackingType = 'radio',
}: RadioGroupProps<T>) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-slate-700">{legend}</legend>
      <div
        className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}
      >
        {options.map((opt) => {
          const id = `${name}-${opt.value}`
          const selected = value === opt.value
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={`flex cursor-pointer flex-col rounded-xl border p-4 transition ${
                selected
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={selected}
                  onChange={() => onChange(opt.value)}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500"
                  {...(trackingName ? { 'data-tracking-name': trackingName } : {})}
                  {...(trackingType ? { 'data-tracking-type': trackingType } : {})}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {opt.description}
                    </span>
                  )}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}