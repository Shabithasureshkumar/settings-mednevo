import { useState } from 'react'
import { ChevronDown, Contrast, Globe, PersonStanding, ScanText, Type, Volume2, Ban } from 'lucide-react'
import { Toggle } from '../components/ui'

const sizes = ['Small', 'Standard', 'Large', 'Extra Large']

const controls = [
  { t: 'High contrast mode', d: 'Increase visual distinction between elements', icon: Contrast, on: false },
  { t: 'Screen reader optimizations', d: 'Semantic HTML structural enhancements', icon: ScanText, on: true },
  { t: 'Audio summaries', d: 'Read key healthcare insights aloud', icon: Volume2, on: false },
  { t: 'Reduce motion', d: 'Disable animations and transitions', icon: Ban, on: false },
]

function Select({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] text-gray-500">{label}</span>
      <div className="relative">
        <select
          defaultValue={value}
          className="h-12 w-full appearance-none rounded-xl border border-brand-200 bg-brand-50/60 px-4 text-sm text-gray-800 outline-none"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    </label>
  )
}

export default function Language() {
  const [size, setSize] = useState(1)

  return (
    <div className="rounded-2xl bg-slate-50 px-8 pb-10 pt-1">
      <h1 className="text-[28px] font-bold tracking-tight">Language &amp; Accessibility</h1>
      <p className="mt-1 text-sm text-gray-500">Customize your viewing experience to suit your reading and navigation preferences.</p>

      <div className="mt-6 rounded-2xl bg-white/80 p-6">
        <h3 className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-ink">
            <Globe className="h-4 w-4" />
          </span>
          Preferred Language
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Select label="Display Language" value="English (US)" options={['English (US)', 'English (UK)', 'தமிழ்', 'हिन्दी']} />
          <Select label="Translation Style" value="Direct Translation" options={['Direct Translation', 'Simplified Medical Terms']} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/80 p-6">
        <h3 className="flex items-center gap-3 text-lg font-semibold">
          <Type className="h-5 w-5 text-brand-ink" /> Text Size
        </h3>
        <div className="mt-6 grid grid-cols-4 items-center px-2 text-sm">
          {sizes.map((s, i) =>
            i === size ? (
              <span key={s} className="justify-self-center rounded-full bg-brand-50 px-4 py-1.5 font-semibold text-brand-ink">
                {s}
              </span>
            ) : (
              <span
                key={s}
                className={`${i === 0 ? 'justify-self-start text-xs' : i === 3 ? 'justify-self-end text-lg' : 'justify-self-center'} text-gray-400`}
              >
                {i === 2 ? '' : s}
              </span>
            ),
          )}
        </div>
        <input
          type="range"
          min={0}
          max={3}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-brand-200 accent-brand-ink"
        />
      </div>

      <div className="mt-4 rounded-2xl bg-white/80 p-6">
        <h3 className="flex items-center gap-3 text-lg font-semibold">
          <PersonStanding className="h-5 w-5 text-brand-ink" /> Visual &amp; Audio Controls
        </h3>
        <div className="mt-3">
          {controls.map((c) => (
            <div key={c.t} className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0">
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                  <c.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{c.t}</p>
                  <p className="text-[11px] text-gray-400">{c.d}</p>
                </div>
              </div>
              <Toggle size="sm" defaultChecked={c.on} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="rounded-xl bg-brand-gradient px-7 py-3 text-sm font-semibold text-white">Save Changes</button>
        <button className="rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm text-gray-600">Reset to Defaults</button>
      </div>
    </div>
  )
}
