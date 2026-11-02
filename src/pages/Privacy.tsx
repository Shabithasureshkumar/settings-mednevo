import { useState } from 'react'
import { AtSign, History, ShieldCheck } from 'lucide-react'
import { Card, Toggle } from '../components/ui'
import { Modal, btnGhost, useApp, useToast } from '../components/feedback'

const items = [
  { t: 'AI Data Processing', d: 'Allow our AI to analyze trends in your health data for better insights and personalized recommendations.', on: true },
  { t: 'Share Vitals with Care Team', d: 'Automatically sync device data with your primary physician and designated specialists.', on: true },
  { t: 'Share Cycle Data with Care Team', d: 'Include menstrual cycle and symptom history in reports shared with your healthcare providers.', on: false },
  { t: 'Allow Data for Research (De-Identified)', d: 'Help medical research by sharing anonymous, de-identified health metrics with verified institutions.', on: true },
  { t: 'Marketing Communications', d: 'Receive updates about new wellness programs, feature launches, and community events.', on: false },
]

export default function Privacy() {
  const toast = useToast()
  const { go } = useApp()
  const [policy, setPolicy] = useState(false)

  return (
    <Card className="mt-2 p-8">
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-ink" />
        <h1 className="text-xl font-bold">Privacy &amp; Consent</h1>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((i) => (
          <div key={i.t} className="flex items-start justify-between gap-8 rounded-2xl border border-gray-100 bg-gray-50/70 px-6 py-6">
            <div>
              <p className="text-[16px] font-semibold tracking-wide text-gray-800">{i.t}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">{i.d}</p>
            </div>
            <Toggle
              defaultChecked={i.on}
              onChange={(v) => toast(`${i.t} ${v ? 'enabled' : 'disabled'}.`, v ? 'success' : 'info')}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
        <div className="flex items-center gap-8 text-sm font-semibold text-brand-ink">
          <button onClick={() => setPolicy(true)} className="flex items-center gap-1.5">
            <AtSign className="h-3.5 w-3.5" /> View Full Privacy Policy
          </button>
          <button onClick={() => go('audit')} className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" /> View Audit Log
          </button>
        </div>
        <p className="text-xs text-gray-400">See who has accessed your records</p>
      </div>

      {policy && (
        <Modal title="Privacy Policy" onClose={() => setPolicy(false)} footer={<button className={btnGhost} onClick={() => setPolicy(false)}>Close</button>}>
          <div className="space-y-3 text-sm leading-6 text-gray-600">
            <p>We collect only the health and account data needed to provide your care services.</p>
            <p>Your data is encrypted in transit and at rest, and is shared with your care team only with your consent.</p>
            <p>You can export or delete your data at any time from the Data section of Settings.</p>
          </div>
        </Modal>
      )}
    </Card>
  )
}
