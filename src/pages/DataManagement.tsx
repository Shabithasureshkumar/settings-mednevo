import { ArrowRight, Download, Heart, PaintbrushVertical, SquareX, TriangleAlert, Activity } from 'lucide-react'
import { PageHeader, Toggle } from '../components/ui'

export default function DataManagement() {
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
          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white">
            Request data export <ArrowRight className="h-4 w-4" />
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
            <span className="font-mono text-sm text-brand-500">24 MB</span>
          </div>
          <button className="mt-3 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-800">
            Clear cache
          </button>
        </div>
      </div>

      {/* Third-party apps */}
      <div className="mt-6 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between bg-brand-50/50 px-7 py-6">
          <h3 className="text-xl font-semibold">Connected Third-party Apps</h3>
          <span className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-ink">2 Active Connections</span>
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
            <Toggle defaultChecked />
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
          <button className="flex items-center gap-2 rounded-xl bg-danger px-6 py-3.5 text-[15px] font-semibold text-white">
            <SquareX className="h-4 w-4" /> Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
