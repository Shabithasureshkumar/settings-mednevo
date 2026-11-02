import { useState } from 'react'
import { ChevronDown, Contrast, Globe, PersonStanding, ScanText, Type, Volume2, Ban } from 'lucide-react'
import { Toggle } from '../components/ui'
import { useToast } from '../components/feedback'

const sizes = ['Small', 'Standard', 'Large', 'Extra Large']
const rootSizes = ['87.5%', '100%', '112.5%', '125%']

export interface Accessibility {
  display: string
  style: string
  size: number
  contrast: boolean
  reader: boolean
  audio: boolean
  motion: boolean
}

export const defaultAccessibility: Accessibility = {
  display: 'English (US)',
  style: 'Direct Translation',
  size: 1,
  contrast: false,
  reader: true,
  audio: false,
  motion: false,
}

const STORAGE_KEY = 'mednevo.accessibility'

export function loadAccessibility(): Accessibility {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultAccessibility, ...JSON.parse(raw) }
  } catch {
    // storage unavailable or corrupt: fall back to defaults
  }
  return defaultAccessibility
}

function saveAccessibility(a: Accessibility) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a))
  } catch {
    // storage unavailable: the settings still apply for this session
  }
}

export function applyAccessibility(a: Accessibility) {
  const root = document.documentElement
  root.style.fontSize = rootSizes[a.size] ?? '100%'
  root.classList.toggle('a11y-contrast', a.contrast)
  root.classList.toggle('a11y-reduce-motion', a.motion)
}

const controls: { t: string; d: string; icon: typeof Contrast; key: 'contrast' | 'reader' | 'audio' | 'motion' }[] = [
  { t: 'High contrast mode', d: 'Increase visual distinction between elements', icon: Contrast, key: 'contrast' },
  { t: 'Screen reader optimizations', d: 'Semantic HTML structural enhancements', icon: ScanText, key: 'reader' },
  { t: 'Audio summaries', d: 'Read key healthcare insights aloud', icon: Volume2, key: 'audio' },
  { t: 'Reduce motion', d: 'Disable animations and transitions', icon: Ban, key: 'motion' },
]

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] text-gray-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  const toast = useToast()
  const [saved, setSaved] = useState(loadAccessibility)
  const [draft, setDraft] = useState(saved)
  const size = draft.size
  const setSize = (n: number) => setDraft((d) => ({ ...d, size: n }))
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)

  const save = () => {
    saveAccessibility(draft)
    applyAccessibility(draft)
    setSaved(draft)
    toast('Language and accessibility settings saved.')
  }

  const reset = () => {
    setDraft(defaultAccessibility)
    saveAccessibility(defaultAccessibility)
    applyAccessibility(defaultAccessibility)
    setSaved(defaultAccessibility)
    toast('Settings reset to defaults.', 'info')
  }

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
          <Select label="Display Language" value={draft.display} options={['English (US)', 'English (UK)', 'தமிழ்', 'हिन्दी']} onChange={(v) => setDraft({ ...draft, display: v })} />
          <Select label="Translation Style" value={draft.style} options={['Direct Translation', 'Simplified Medical Terms']} onChange={(v) => setDraft({ ...draft, style: v })} />
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
              <Toggle size="sm" checked={draft[c.key]} onChange={(v) => setDraft({ ...draft, [c.key]: v })} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={save}
          disabled={!dirty}
          className="rounded-xl bg-brand-gradient px-7 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save Changes
        </button>
        <button onClick={reset} className="rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm text-gray-600">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
