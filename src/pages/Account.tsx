import { AlarmClock, Apple, CircleCheck, Contact, Lock, Pencil, PlusCircle, ShieldCheck, Watch, Activity } from 'lucide-react'
import { Card, IconBadge, Pill, Toggle } from '../components/ui'

const fields = [
  { label: 'Full Name', value: 'Sarah Johnson' },
  { label: 'Email Address', value: 'sara@example.com' },
  { label: 'Phone Number', value: '+1 555-123-4567' },
  { label: 'Date of Birth', value: 'March 15, 1985', locked: true },
  { label: 'Gender', value: 'Female' },
  { label: 'Preferred Language', value: 'English (US)' },
]

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  )
}

export default function Account() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-6">
        {/* Personal information */}
        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBadge size="h-8 w-8" rounded="rounded-lg">
                <Contact className="h-4 w-4" />
              </IconBadge>
              <h3 className="text-xl font-bold">Personal Information</h3>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-brand-ink px-5 py-2.5 text-sm font-semibold text-brand-ink">
              <Pencil className="h-4 w-4" /> Edit Details
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-7 gap-y-5">
            {fields.map((f) => (
              <label key={f.label} className="block">
                <span className="mb-2 flex items-center gap-1 text-xs text-gray-700">
                  {f.label} {f.locked && <Lock className="h-3 w-3" />}
                </span>
                <input
                  defaultValue={f.value}
                  readOnly={f.locked}
                  className={`h-14 w-full rounded-2xl bg-gray-100 px-5 text-[15px] outline-none focus:ring-2 focus:ring-brand-200 ${
                    f.locked ? 'text-gray-400' : 'text-gray-800'
                  }`}
                />
              </label>
            ))}
          </div>
        </Card>

        {/* Login & Security */}
        <Card className="p-7">
          <div className="mb-8 flex items-center gap-3">
            <IconBadge size="h-8 w-8" rounded="rounded-lg">
              <ShieldCheck className="h-4 w-4" />
            </IconBadge>
            <h3 className="text-xl font-bold">Login &amp; Security</h3>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <p className="text-sm font-semibold text-gray-800">Password</p>
              <p className="text-sm text-gray-500">Last changed 2 months ago</p>
            </div>
            <button className="text-[15px] font-medium text-brand-ink">Change Password</button>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-6">
            <div>
              <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-red-600">Status: Off — Recommended for security</p>
            </div>
            <button className="rounded-2xl bg-navy px-6 py-2.5 text-sm font-semibold text-white">Enable</button>
          </div>

          <div className="pt-6">
            <p className="mb-4 text-sm font-semibold text-gray-800">Linked Accounts</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-3 rounded-2xl border border-brand-ink/60 bg-brand-50 px-5 py-3 text-sm font-semibold text-gray-800">
                <Apple className="h-4 w-4" fill="currentColor" /> Apple Connected
                <CircleCheck className="h-4 w-4 text-brand-ink" />
              </button>
              <button className="flex items-center gap-3 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800">
                <GoogleIcon /> Connect Google
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <IconBadge size="h-8 w-8" rounded="rounded-lg">
              <AlarmClock className="h-4 w-4" />
            </IconBadge>
            <h3 className="text-xl font-bold">Communication Preferences</h3>
          </div>
          {[
            { t: 'SMS Reminders', d: 'Appointments and alerts' },
            { t: 'Health Tips Email', d: 'Monthly wellness newsletter' },
          ].map((r) => (
            <div key={r.t} className="mb-3 flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 last:mb-0">
              <div>
                <p className="text-sm font-semibold text-navy">{r.t}</p>
                <p className="text-sm text-gray-500">{r.d}</p>
              </div>
              <Toggle defaultChecked />
            </div>
          ))}
        </Card>

        {/* Danger zone */}
        <div className="border-t border-gray-100 px-6 pt-6">
          <p className="text-sm font-semibold text-gray-800">Danger Zone</p>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="mt-4 w-full rounded-2xl border border-red-700 py-3 text-sm font-semibold text-red-700">
            Deactivate Account
          </button>
          <button className="mt-3 w-full rounded-2xl bg-danger py-3 text-sm font-semibold text-white">
            Delete Permanently
          </button>
        </div>

        {/* Connected devices */}
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold">Connected Devices</h3>
            <PlusCircle className="h-5 w-5 text-brand-ink" />
          </div>
          <div className="mb-4 rounded-2xl border border-gray-100 p-4 shadow-card">
            <div className="flex items-start justify-between">
              <IconBadge className="bg-gray-100 text-gray-700">
                <Watch className="h-4 w-4" />
              </IconBadge>
              <Pill className="bg-green-100 text-green-600">Active</Pill>
            </div>
            <p className="mt-4 text-sm font-semibold">Apple Watch Ultra 2</p>
            <p className="text-xs text-gray-400">Last synced: 2m ago</p>
            <div className="mt-4 h-1.5 w-full rounded-full bg-brand-50">
              <div className="h-full w-[82%] rounded-full bg-brand-gradient" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase">
              <span className="text-gray-400">Battery</span>
              <span className="text-brand-deep">82%</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4 shadow-card">
            <div className="flex items-start justify-between">
              <IconBadge className="bg-gray-100 text-gray-700">
                <Activity className="h-4 w-4" />
              </IconBadge>
              <Pill className="bg-red-100 text-red-500">Low Batt</Pill>
            </div>
            <p className="mt-4 text-sm font-semibold">VitaPulse Nano</p>
            <p className="text-xs text-gray-400">Calibration required in 4 days</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
