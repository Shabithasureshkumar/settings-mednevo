import { useState, type ReactNode } from 'react'

/* ---------------- Toggle ---------------- */
interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (value: boolean) => void
  size?: 'sm' | 'md'
}

export function Toggle({ checked, defaultChecked = false, onChange, size = 'md' }: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked)
  const isOn = checked ?? internal

  const toggle = () => {
    const next = !isOn
    if (checked === undefined) setInternal(next)
    onChange?.(next)
  }

  const track = size === 'sm' ? 'h-5 w-10' : 'h-6 w-12'
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'
  const shift = size === 'sm' ? 'translate-x-5' : 'translate-x-6'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={toggle}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ${track} ${
        isOn ? 'bg-brand-gradient' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block transform rounded-full bg-white shadow transition-transform duration-200 ${knob} ${
          isOn ? shift : 'translate-x-[3px]'
        }`}
      />
    </button>
  )
}

/* ---------------- Card ---------------- */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-gray-100 bg-white shadow-card ${className}`}>{children}</div>
  )
}

/* ---------------- Icon badge ---------------- */
export function IconBadge({
  children,
  className = 'bg-brand-50 text-brand-500',
  size = 'h-9 w-9',
  rounded = 'rounded-xl',
}: {
  children: ReactNode
  className?: string
  size?: string
  rounded?: string
}) {
  return <div className={`flex shrink-0 items-center justify-center ${size} ${rounded} ${className}`}>{children}</div>
}

/* ---------------- Status pill ---------------- */
export function Pill({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}>
      {children}
    </span>
  )
}

/* ---------------- Page header ---------------- */
export function PageHeader({ title, subtitle, right }: { title: ReactNode; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
