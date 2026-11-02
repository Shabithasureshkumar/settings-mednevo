import { useState } from 'react'
import { AlarmClock, Check, BarChart3, ShieldCheck, Sprout } from 'lucide-react'
import { Toggle } from '../components/ui'
import { Modal, btnGhost, useToast } from '../components/feedback'
import analyticsImg from '../assets/analytics-cells.png'

function Row({ t, d, on, onChange }: { t: string; d: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-5">
      <div>
        <p className="text-sm font-semibold text-gray-800">{t}</p>
        <p className="text-xs text-gray-500">{d}</p>
      </div>
      <Toggle checked={on} onChange={onChange} />
    </div>
  )
}

const inputCls = 'h-14 rounded-2xl border border-teal-100 bg-white px-5 text-[15px] text-gray-800 outline-none focus:ring-2 focus:ring-brand-200'

const defaults = {
  cycle: '28',
  period: '5',
  luteal: '14',
  alerts: { period: false, ovulation: false, fertile: false, symptoms: false, sharing: false },
}

const ranges = {
  cycle: { min: 21, max: 45, label: 'Cycle length' },
  period: { min: 1, max: 10, label: 'Period duration' },
  luteal: { min: 8, max: 18, label: 'Luteal phase length' },
} as const

type RangeKey = keyof typeof ranges

// Accepts "5", "5 Days" etc. and returns the number part
const num = (v: string) => Number(v.replace(/\D/g, ''))

export default function PeriodTracker() {
  const toast = useToast()
  const [saved, setSaved] = useState(defaults)
  const [vals, setVals] = useState({ cycle: defaults.cycle, period: defaults.period, luteal: defaults.luteal })
  const [alerts, setAlerts] = useState(defaults.alerts)
  const [errors, setErrors] = useState<Partial<Record<RangeKey, string>>>({})
  const [insights, setInsights] = useState(false)

  const setAlert = (k: keyof typeof alerts) => (v: boolean) => setAlerts((a) => ({ ...a, [k]: v }))

  const save = () => {
    const e: Partial<Record<RangeKey, string>> = {}
    ;(Object.keys(ranges) as RangeKey[]).forEach((k) => {
      const n = num(vals[k])
      const r = ranges[k]
      if (!vals[k].trim() || Number.isNaN(n) || n < r.min || n > r.max) e[k] = `${r.label} must be ${r.min}-${r.max} days.`
    })
    setErrors(e)
    if (Object.keys(e).length) return toast('Please fix the highlighted values.', 'error')
    const clean = { cycle: String(num(vals.cycle)), period: String(num(vals.period)), luteal: String(num(vals.luteal)) }
    setVals(clean)
    setSaved({ ...clean, alerts })
    toast('Cycle configuration saved.')
  }

  const discard = () => {
    setVals({ cycle: saved.cycle, period: saved.period, luteal: saved.luteal })
    setAlerts(saved.alerts)
    setErrors({})
    toast('Changes discarded.', 'info')
  }

  const field = (k: RangeKey, width: string, center = false) => (
    <div>
      <div className="flex items-center gap-5">
        <input
          value={vals[k]}
          inputMode="numeric"
          onChange={(e) => setVals({ ...vals, [k]: e.target.value })}
          className={`${inputCls} ${width} ${center ? 'text-center' : ''} ${errors[k] ? 'border-red-300' : ''}`}
        />
        <span className="text-[15px] text-gray-700">days</span>
      </div>
      {errors[k] && <p className="mt-1 max-w-[220px] text-xs text-red-600">{errors[k]}</p>}
    </div>
  )

  return (
    <div className="grid grid-cols-[1fr_340px] gap-8">
      {/* Settings card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-ink">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Cycle Parameters</h2>
            <p className="text-sm text-gray-500">Configure your biological baseline for more accurate clinical predictions.</p>
          </div>
        </div>

        <div className="mt-6 flex items-end gap-6 border-b border-gray-100 pb-7">
          <label className="block">
            <span className="mb-2 block text-xs text-gray-800">Cycle Length</span>
            {field('cycle', 'w-[120px]', true)}
          </label>
          <label className="block">
            <span className="mb-2 block text-xs text-gray-800">Period Duration</span>
            {field('period', 'w-[120px]', true)}
          </label>
          <label className="block">
            <span className="mb-2 block text-xs text-gray-800">Luteal Phase Length</span>
            {field('luteal', 'w-[120px]', true)}
          </label>
        </div>

        <h3 className="mt-7 flex items-center gap-2 text-lg font-semibold">
          <AlarmClock className="h-5 w-5 text-brand-ink" /> Smart Alerts
        </h3>
        <Row t="Period Reminder" d="Notify me 2 days before predicted start." on={alerts.period} onChange={setAlert('period')} />
        <Row t="Ovulation Reminder" d="High-precision peak notification." on={alerts.ovulation} onChange={setAlert('ovulation')} />
        <Row t="Fertile Window Visibility" d="Show 6-day prediction window on dashboard." on={alerts.fertile} onChange={setAlert('fertile')} />

        <h3 className="mt-3 flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-5 w-5 text-brand-ink" fill="currentColor" stroke="white" /> Privacy &amp; Logging
        </h3>
        <Row t="Daily Symptoms Prompt" d="Log mood, energy, and physical markers." on={alerts.symptoms} onChange={setAlert('symptoms')} />
        <Row t="Cycle Data Sharing" d="Allow HealthCore AI to analyze trends for better accuracy." on={alerts.sharing} onChange={setAlert('sharing')} />

        <div className="mt-8 flex items-center justify-end gap-10">
          <button onClick={discard} className="text-[15px] text-brand-ink">Discard Changes</button>
          <button onClick={save} className="rounded-2xl bg-brand-gradient px-8 py-3.5 text-[15px] text-white shadow-brand">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl bg-brand-gradient-diag p-8 text-white">
          <p className="text-[15px] uppercase leading-7 tracking-[0.15em] text-white/80">
            Next Period
            <br />
            Countdown
          </p>
          <p className="mt-6">
            <span className="text-[48px] font-bold leading-none">14</span>
            <span className="ml-3 text-[15px] text-white/80">Days</span>
          </p>
          <p className="mt-4 text-[15px] text-white/80">Expected: Oct 24, 2023</p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-4">
            <Sprout className="h-5 w-5 shrink-0" />
            <p className="text-xs leading-5">High hormone stability predicted for today.</p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-gray-200 p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] uppercase tracking-[0.12em] text-gray-500">Logging Health</p>
              <p className="mt-1 text-xl font-semibold text-brand-ink">88% Consistency</p>
            </div>
            <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#5C24FF" strokeWidth="2.5" strokeDasharray="83 100" strokeLinecap="round" pathLength="100" />
            </svg>
          </div>
          <ul className="mt-6 space-y-4 text-sm">
            {['6-month logging streak', 'Symptoms synced daily'].map((t) => (
              <li key={t} className="flex items-center gap-3 font-medium text-gray-800">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-800 text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
            <li className="flex items-center gap-3 text-gray-300">
              <span className="h-5 w-5 rounded-full border border-gray-300" /> Basal temp missing (3 days)
            </li>
          </ul>
          <button
            onClick={() => setInsights(true)}
            className="mt-7 w-full rounded-2xl border border-brand-ink py-3 text-[17px] text-brand-ink"
          >
            View Insights Report
          </button>
        </div>

        <div className="relative h-[260px] overflow-hidden rounded-3xl">
          <img src={analyticsImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5C24FF]/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-lg">Advanced Analytics Enabled</p>
            <p className="text-sm text-white/80">Hormonal trend mapping active.</p>
          </div>
        </div>
      </div>

      {insights && (
        <Modal title="Insights report" onClose={() => setInsights(false)} footer={<button className={btnGhost} onClick={() => setInsights(false)}>Close</button>}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Average cycle length</dt><dd className="font-semibold">{saved.cycle} days</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Average period duration</dt><dd className="font-semibold">{saved.period} days</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Luteal phase</dt><dd className="font-semibold">{saved.luteal} days</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Logging consistency</dt><dd className="font-semibold">88%</dd></div>
          </dl>
        </Modal>
      )}
    </div>
  )
}
