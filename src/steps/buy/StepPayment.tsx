import { useState } from 'react'
import { useQuoteWizard } from '../../context/QuoteContext'
import { generatePolicyNumber } from '../../utils/policyNumber'
import { formatAud } from '../../utils/pricing'
import { WizardLayout } from '../../components/layout/WizardLayout'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'

export function StepPayment() {
  const { form, updateSection, quote, goBack, goNext, setPolicyNumber } =
    useQuoteWizard()
  const { payment } = form
  const [processing, setProcessing] = useState(false)

  const handlePay = async () => {
    if (
      !payment.cardName.trim() ||
      payment.cardNumber.replace(/\s/g, '').length < 15
    ) {
      alert('Please enter mock card details.')
      return
    }
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1200))
    setPolicyNumber(generatePolicyNumber())
    setProcessing(false)
    goNext()
  }

  return (
    <WizardLayout
      title="Payment"
      subtitle="Enter test card details — this step simulates checkout only."
      footer={
        <>
          <Button trackingName="back" variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button trackingName="pay" onClick={handlePay} disabled={processing}>
            {processing ? 'Processing…' : `Pay ${formatAud(quote.annualTotal)}`}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField
          trackingName="card-name"
          label="Name on card"
          name="cardName"
          autoComplete="cc-name"
          value={payment.cardName}
          onChange={(e) =>
            updateSection('payment', { cardName: e.target.value })
          }
        />
        <FormField
          trackingName="card-number"
          label="Card number"
          name="cardNumber"
          inputMode="numeric"
          placeholder="4111 1111 1111 1111"
          autoComplete="cc-number"
          value={payment.cardNumber}
          onChange={(e) =>
            updateSection('payment', {
              cardNumber: e.target.value.replace(/[^\d\s]/g, ''),
            })
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            trackingName="expiry"
            label="Expiry (MM/YY)"
            name="expiry"
            placeholder="12/28"
            autoComplete="cc-exp"
            value={payment.expiry}
            onChange={(e) =>
              updateSection('payment', { expiry: e.target.value })
            }
          />
          <FormField
            trackingName="cvv"
            label="CVV"
            name="cvv"
            type="password"
            maxLength={4}
            autoComplete="cc-csc"
            value={payment.cvv}
            onChange={(e) =>
              updateSection('payment', { cvv: e.target.value })
            }
          />
        </div>
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Prototype mode: any valid-looking card number completes the purchase.
        </p>
      </div>
    </WizardLayout>
  )
}
