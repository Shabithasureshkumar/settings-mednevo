import { useState } from 'react'
import { AlarmClock, Apple, CircleCheck, Contact, Lock, Pencil, PlusCircle, ShieldCheck, Watch, Activity } from 'lucide-react'
import { Card, IconBadge, Pill, Toggle } from '../components/ui'
import { ConfirmModal, Field, Modal, btnGhost, btnPrimary, inputCls, useApp, useToast } from '../components/feedback'

type Key = 'name' | 'email' | 'phone' | 'dob' | 'gender' | 'language'

const fields: { key: Key; label: string; locked?: boolean; options?: string[] }[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'dob', label: 'Date of Birth', locked: true },
  { key: 'gender', label: 'Gender', options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'] },
  { key: 'language', label: 'Preferred Language', options: ['English (US)', 'English (UK)', 'தமிழ்', 'हिन्दी'] },
]

const initial: Record<Key, string> = {
  name: 'Sarah Johnson',
  email: 'sara@example.com',
  phone: '+1 555-123-4567',
  dob: 'March 15, 1985',
  gender: 'Female',
  language: 'English (US)',
}

function validate(v: Record<Key, string>) {
  const errors: Partial<Record<Key, string>> = {}
  if (!v.name.trim()) errors.name = 'Full name is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Enter a valid email address.'
  if (v.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number.'
  return errors
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = () => {
    const e: Record<string, string> = {}
    if (!cur) e.cur = 'Enter your current password.'
    if (next.length < 8) e.next = 'Use at least 8 characters.'
    else if (!/\d/.test(next) || !/[a-zA-Z]/.test(next)) e.next = 'Include both letters and numbers.'
    else if (next === cur) e.next = 'New password must differ from the current one.'
    if (again !== next) e.again = 'Passwords do not match.'
    setErrors(e)
    if (Object.keys(e).length) return
    toast('Password changed successfully.')
    onClose()
  }

  return (
    <Modal
      title="Change password"
      onClose={onClose}
      footer={
        <>
          <button className={btnGhost} onClick={onClose}>Cancel</button>
          <button className={btnPrimary} onClick={submit}>Update password</button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit() }}>
        <Field label="Current password" error={errors.cur}>
          <input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} className={inputCls} autoFocus />
        </Field>
        <Field label="New password" error={errors.next}>
          <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Confirm new password" error={errors.again}>
          <input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={inputCls} />
        </Field>
      </form>
    </Modal>
  )
}

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

type Dialog = null | 'password' | '2fa' | 'deactivate' | 'delete'

export default function Account() {
  const toast = useToast()
  const { go, signOut } = useApp()
  const [saved, setSaved] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [dialog, setDialog] = useState<Dialog>(null)
  const [twoFA, setTwoFA] = useState(false)
  const [apple, setApple] = useState(true)
  const [google, setGoogle] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  const startEdit = () => {
    setDraft(saved)
    setErrors({})
    setEditing(true)
  }
  const cancelEdit = () => {
    setEditing(false)
    setErrors({})
  }
  const saveEdit = () => {
    const e = validate(draft)
    setErrors(e)
    if (Object.keys(e).length) return toast('Please fix the highlighted fields.', 'error')
    setSaved({ ...draft, name: draft.name.trim(), email: draft.email.trim() })
    setEditing(false)
    toast('Personal details saved.')
  }

  const verify2FA = () => {
    if (!/^\d{6}$/.test(code)) return setCodeError('Enter the 6-digit code from your authenticator app.')
    setTwoFA(true)
    setDialog(null)
    toast('Two-factor authentication enabled.')
  }

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
            {editing ? (
              <div className="flex gap-2">
                <button onClick={cancelEdit} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600">
                  Cancel
                </button>
                <button onClick={saveEdit} className="rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white">
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 rounded-xl border border-brand-ink px-5 py-2.5 text-sm font-semibold text-brand-ink"
              >
                <Pencil className="h-4 w-4" /> Edit Details
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-7 gap-y-5">
            {fields.map((f) => {
              const readOnly = f.locked || !editing
              const cls = `h-14 w-full rounded-2xl bg-gray-100 px-5 text-[15px] outline-none focus:ring-2 focus:ring-brand-200 ${
                f.locked ? 'text-gray-400' : 'text-gray-800'
              } ${errors[f.key] ? 'ring-2 ring-red-300' : ''}`
              const value = editing ? draft[f.key] : saved[f.key]
              return (
                <label key={f.key} className="block">
                  <span className="mb-2 flex items-center gap-1 text-xs text-gray-700">
                    {f.label} {f.locked && <Lock className="h-3 w-3" />}
                  </span>
                  {f.options && editing ? (
                    <select value={value} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className={cls}>
                      {f.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={value}
                      readOnly={readOnly}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                      className={cls}
                    />
                  )}
                  {errors[f.key] && <span className="mt-1 block text-xs text-red-600">{errors[f.key]}</span>}
                </label>
              )
            })}
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
            <button onClick={() => setDialog('password')} className="text-[15px] font-medium text-brand-ink">
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-6">
            <div>
              <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication (2FA)</p>
              {twoFA ? (
                <p className="text-sm text-green-600">Status: On — Your account is protected</p>
              ) : (
                <p className="text-sm text-red-600">Status: Off — Recommended for security</p>
              )}
            </div>
            <button
              onClick={() => {
                if (twoFA) {
                  setTwoFA(false)
                  toast('Two-factor authentication disabled.', 'info')
                } else {
                  setCode('')
                  setCodeError('')
                  setDialog('2fa')
                }
              }}
              className="rounded-2xl bg-navy px-6 py-2.5 text-sm font-semibold text-white"
            >
              {twoFA ? 'Disable' : 'Enable'}
            </button>
          </div>

          <div className="pt-6">
            <p className="mb-4 text-sm font-semibold text-gray-800">Linked Accounts</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setApple(!apple)
                  toast(apple ? 'Apple account disconnected.' : 'Apple account connected.', apple ? 'info' : 'success')
                }}
                className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-semibold text-gray-800 ${
                  apple ? 'border-brand-ink/60 bg-brand-50' : 'border-gray-200'
                }`}
              >
                <Apple className="h-4 w-4" fill="currentColor" /> {apple ? 'Apple Connected' : 'Connect Apple'}
                {apple && <CircleCheck className="h-4 w-4 text-brand-ink" />}
              </button>
              <button
                onClick={() => {
                  setGoogle(!google)
                  toast(google ? 'Google account disconnected.' : 'Google account connected.', google ? 'info' : 'success')
                }}
                className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-semibold text-gray-800 ${
                  google ? 'border-brand-ink/60 bg-brand-50' : 'border-gray-200'
                }`}
              >
                <GoogleIcon /> {google ? 'Google Connected' : 'Connect Google'}
                {google && <CircleCheck className="h-4 w-4 text-brand-ink" />}
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
          <button
            onClick={() => setDialog('deactivate')}
            className="mt-4 w-full rounded-2xl border border-red-700 py-3 text-sm font-semibold text-red-700"
          >
            Deactivate Account
          </button>
          <button
            onClick={() => setDialog('delete')}
            className="mt-3 w-full rounded-2xl bg-danger py-3 text-sm font-semibold text-white"
          >
            Delete Permanently
          </button>
        </div>

        {/* Connected devices */}
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold">Connected Devices</h3>
            <button aria-label="Add device" onClick={() => go('devices')}>
              <PlusCircle className="h-5 w-5 text-brand-ink" />
            </button>
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

      {dialog === 'password' && <PasswordModal onClose={() => setDialog(null)} />}
      {dialog === '2fa' && (
        <Modal
          title="Enable two-factor authentication"
          onClose={() => setDialog(null)}
          footer={
            <>
              <button className={btnGhost} onClick={() => setDialog(null)}>Cancel</button>
              <button className={btnPrimary} onClick={verify2FA}>Verify &amp; enable</button>
            </>
          }
        >
          <p className="mb-4 text-sm leading-6 text-gray-600">
            Open your authenticator app and enter the 6-digit code to finish setup.
          </p>
          <Field label="Verification code" error={codeError}>
            <input
              value={code}
              inputMode="numeric"
              maxLength={6}
              autoFocus
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && verify2FA()}
              className={inputCls}
            />
          </Field>
        </Modal>
      )}
      {dialog === 'deactivate' && (
        <ConfirmModal
          title="Deactivate account?"
          message="Your account will be hidden and you will be signed out. You can reactivate it by signing in again."
          confirmLabel="Deactivate"
          danger
          onConfirm={() => {
            toast('Account deactivated.', 'info')
            signOut()
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'delete' && (
        <ConfirmModal
          title="Delete account permanently?"
          message="This erases your patient record and cannot be undone."
          confirmLabel="Delete permanently"
          requireText="DELETE"
          danger
          onConfirm={() => {
            toast('Account deleted.', 'info')
            signOut()
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}
