import { ArrowRight, Download, Heart, PaintbrushVertical, SquareX, TriangleAlert, Activity } from 'lucide-react'
import { useState } from 'react'
import { PageHeader, Toggle } from '../components/ui'
import { ConfirmModal, useApp, useToast } from '../components/feedback'

export default function DataManagement() {
  const toast = useToast()
  const { signOut } = useApp()
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const [cacheMb, setCacheMb] = useState(24)
  const [clearing, setClearing] = useState(false)
  const [apps, setApps] = useState({ 'Apple Health': true, 'Google Fit': true })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const activeCount = Object.values(apps).filter(Boolean).length

  const requestExport = () => {
    setRequesting(true)
    window.setTimeout(() => {
      setRequesting(false)
      setRequested(true)
      toast('Export requested. We will email you a download link within 24 hours.')
    }, 900)
  }

  const clearCache = async () => {
    setClearing(true)
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } catch {
      // Cache Storage can be unavailable (private mode); the displayed size still resets
    }
    setCacheMb(0)
    setClearing(false)
    toast('Cache cleared.')
  }

  return (
    <div>
      <PageHeader
        title="Data Management"
        subtitle="Manage how your health information is stored, shared, and exported within the HealthCore ecosystem."
      />

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-ink">
            <Download className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-semibold">Download My Health Data</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Receive a secure ZIP archive of your medical history, vitals, and reports.
          </p>
          <button
            onClick={requestExport}
            disabled={requesting || requested}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {requesting ? 'Requesting…' : requested ? 'Export requested' : 'Request data export'}
            {!requested && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mx-auto mt-3 max-w-[220px] text-center text-[10px] leading-4 text-gray-500">
            A link will be sent to your registered email address within 24 hours.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-500">
            <PaintbrushVertical className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-semibold">Clear Cached Data</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Remove temporary local files to free up space and refresh application state.
          </p>
          <div className="mt-6 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-gray-800">Current Cache Size</span>
            <span className="font-mono text-sm text-brand-500">{cacheMb} MB</span>
          </div>
          <button
            onClick={clearCache}
            disabled={clearing || cacheMb === 0}
            className="mt-3 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-800 disabled:opacity-60"
          >
            {clearing ? 'Clearing…' : 'Clear cache'}
          </button>
        </div>
      </div>

      {/* Third-party apps */}
      <div className="mt-6 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between bg-brand-50/50 px-7 py-6">
          <h3 className="text-xl font-semibold">Connected Third-party Apps</h3>
          <span className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-ink">{activeCount} Active {activeCount === 1 ? 'Connection' : 'Connections'}</span>
        </div>
        {[
          { t: 'Apple Health', d: 'Synchronizing heart rate, steps, and sleep cycles.', icon: Heart, cls: 'bg-[#E8523F] text-white' },
          { t: 'Google Fit', d: 'Synchronizing activity minutes and metabolic data.', icon: Activity, cls: 'bg-gray-800 text-white' },
        ].map((a) => (
          <div key={a.t} className="flex items-center justify-between border-b border-gray-100 bg-white px-7 py-6 last:border-0">
            <div className="flex items-center gap-5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-md ${a.cls}`}>
                <a.icon className="h-4 w-4" fill="currentColor" />
              </div>
              <div>
                <p className="text-[15px] font-semibold">{a.t}</p>
                <p className="text-xs text-gray-500">{a.d}</p>
              </div>
            </div>
            <Toggle
              checked={apps[a.t as keyof typeof apps]}
              onChange={(v) => {
                setApps((p) => ({ ...p, [a.t]: v }))
                toast(v ? `${a.t} connected.` : `${a.t} disconnected.`, v ? 'success' : 'info')
              }}
            />
          </div>
        ))}
      </div>

      {/* Delete account */}
      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/30 p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
            <TriangleAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-800">Delete My Account</h3>
            <p className="mt-1 text-[15px] leading-7 text-red-600">
              Permanently erase your patient record and all associated diagnostic data. This action is irreversible and will
              immediately terminate your access to HealthCore services.
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 rounded-xl bg-danger px-6 py-3.5 text-[15px] font-semibold text-white"
          >
            <SquareX className="h-4 w-4" /> Delete account
          </button>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete account permanently?"
          message="This erases your patient record and all associated diagnostic data. It cannot be undone."
          confirmLabel="Delete account"
          requireText="DELETE"
          danger
          onConfirm={() => {
            toast('Account deleted.', 'info')
            signOut()
          }}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
