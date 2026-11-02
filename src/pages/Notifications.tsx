import { useState } from 'react'
import { BellRing, CalendarDays, ChevronRight, FlaskConical, Info, Lock, Mail, MessageSquareMore, Moon, Pill as PillIcon, TriangleAlert } from 'lucide-react'
import { Toggle } from '../components/ui'
import { useApp, useToast } from '../components/feedback'

type Channel = 'push' | 'email' | 'sms'

const categories = [
  { t: 'Appointments', d: 'Reminders and rescheduling notices', icon: CalendarDays, badge: 'bg-brand-100 text-brand-ink', on: { push: true, email: true, sms: false } },
  { t: 'Vitals Alerts', d: 'Abnormal readings from connected devices', icon: TriangleAlert, badge: 'bg-red-50 text-red-500', on: { push: true, email: true, sms: true } },
  { t: 'Medication Reminders', d: 'Dosage schedule and prescription refills', icon: PillIcon, badge: 'bg-brand-100 text-brand-500', on: { push: true, email: false, sms: false } },
  { t: 'Lab Results', d: 'New findings and diagnostic reports', icon: FlaskConical, badge: 'bg-amber-50 text-amber-600', on: { push: true, email: true, sms: false } },
]

export default function Notifications() {
  const toast = useToast()
  const { go } = useApp()
  const [prefs, setPrefs] = useState(categories.map((c) => c.on))
  const [quiet, setQuiet] = useState({ start: '22:00', end: '07:00' })

  const setPref = (i: number, ch: Channel, v: boolean) =>
    setPrefs((p) => p.map((row, idx) => (idx === i ? { ...row, [ch]: v } : row)))

  return (
    <div className="grid grid-cols-[1fr_340px] gap-x-12 gap-y-14 pt-2">
      {/* Preferences table */}
      <section>
        <h1 className="text-2xl font-bold">Notification Preferences</h1>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <p className="max-w-md text-[15px] leading-6 text-gray-500">
            Manage how and when you receive critical health updates.
          </p>
          <span className="shrink-0 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-500">
            Syncing with Device
          </span>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-[1fr_96px_96px_96px] items-center rounded-xl bg-gray-50 px-5 py-4 text-sm text-gray-500">
            <span>Notification Category</span>
            <span className="text-center">Push</span>
            <span className="text-center">Email</span>
            <span className="text-center">SMS</span>
          </div>
          {categories.map((c, i) => (
            <div key={c.t} className="grid grid-cols-[1fr_96px_96px_96px] items-center px-5 py-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.badge}`}>
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.t}</p>
                  <p className="text-xs text-gray-500">{c.d}</p>
                </div>
              </div>
              {(['push', 'email', 'sms'] as Channel[]).map((ch) => (
                <div key={ch} className="flex justify-center">
                  <Toggle checked={prefs[i][ch]} onChange={(v) => setPref(i, ch, v)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Delivery status */}
      <section className="pt-8">
        <h2 className="mb-5 text-2xl font-semibold">Delivery Status</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => toast('Push notifications are delivered to iPhone 15.', 'info')}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-brand-50 to-white p-4 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-white">
              <BellRing className="h-5 w-5" fill="currentColor" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Push Enabled</p>
              <p className="text-xs text-gray-400">Connected to iPhone 15</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={() => toast('Email alerts are sent to alex.r@healthcore.com.', 'info')}
            className="flex items-center gap-4 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-4 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white">
              <Mail className="h-5 w-5" fill="currentColor" stroke="#5C24FF" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Email Enabled</p>
              <p className="text-xs text-gray-400">alex.r@healthcore.com</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={() => {
              toast('Add and verify a phone number to enable SMS.', 'info')
              go('account')
            }}
            className="flex items-center gap-4 rounded-2xl bg-gray-100 p-4 text-left opacity-70"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-400 text-white">
              <MessageSquareMore className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500">SMS Disabled</p>
              <p className="text-xs text-gray-400">No phone verified</p>
            </div>
            <Lock className="h-4 w-4 text-gray-300" />
          </button>
          <button
            onClick={() => toast('Notification settings updated.')}
            className="mt-4 rounded-2xl bg-brand-gradient py-3.5 text-sm font-semibold text-white shadow-brand"
          >
            Update Global Settings
          </button>
        </div>
      </section>

      {/* Quiet hours */}
      <section>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-ink">
            <Moon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Quiet Hours</h3>
            <p className="text-[17px] text-gray-500">Mute non-urgent notifications during rest periods.</p>
          </div>
        </div>
        <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Starts At</p>
            <input
              type="time"
              aria-label="Quiet hours start"
              value={quiet.start}
              onChange={(e) => setQuiet({ ...quiet, start: e.target.value })}
              className="mt-4 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 font-mono text-[15px] text-gray-700 outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ends At</p>
            <input
              type="time"
              aria-label="Quiet hours end"
              value={quiet.end}
              onChange={(e) => setQuiet({ ...quiet, end: e.target.value })}
              className="mt-4 h-12 w-full rounded-xl border border-gray-200 bg-white px-5 font-mono text-[15px] text-gray-700 outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>
        <div className="mt-10 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5">
          <Info className="h-5 w-5 shrink-0 text-brand-ink" />
          <p className="text-sm leading-6 text-gray-600">
            Urgent vitals alerts will bypass Quiet Hours to ensure your safety. Emergency contact protocols remain active.
          </p>
        </div>
      </section>

      {/* Intelligent routing */}
      <section>
        <h3 className="text-2xl font-semibold text-brand-ink">Intelligent Routing</h3>
        <p className="mt-4 text-[17px] leading-8 text-gray-600">
          Our system uses AI to determine the most effective channel for each alert type based on your past engagement levels.
        </p>
        <div className="mt-8 flex items-center gap-2">
          <span className="h-1 w-9 rounded-full bg-brand-ink" />
          <span className="h-1 w-2 rounded-full bg-gray-200" />
          <span className="h-1 w-2 rounded-full bg-gray-200" />
        </div>
        <p className="mt-14 text-sm font-semibold text-gray-400">Recent Alerts</p>
        <ul className="mt-4 space-y-5">
          <li className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-ink" />
            <div>
              <p className="text-sm font-semibold">Appointment Confirmation</p>
              <p className="text-xs text-gray-400">Sent via Push &amp; Email • 2h ago</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-yellow-700" />
            <div>
              <p className="text-sm font-semibold">New Lab Result Ready</p>
              <p className="text-xs text-gray-400">Sent via Push • 5h ago</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  )
}
