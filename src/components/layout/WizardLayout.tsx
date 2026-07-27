import type { ReactNode } from 'react'
import { StepIndicator } from './StepIndicator'

interface WizardLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function WizardLayout({
  title,
  subtitle,
  children,
  footer,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/80 to-surface">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white"
              aria-hidden
            >
              IA
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">
                InsureAU Motor
              </p>
              <p className="text-xs text-slate-500">Car insurance prototype</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <StepIndicator />
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            )}
          </div>
          <div className="text-left">{children}</div>
          {footer && (
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
