import { ArrowRight, ChevronRight, CircleHelp, FileQuestion, FileText, Gavel, Headset, ShieldCheck, ExternalLink, ShieldQuestion } from 'lucide-react'
import { PageHeader } from '../components/ui'

const legal = [
  { t: 'Terms of Service', d: 'The contractual agreement for using HealthCore services.', icon: FileText },
  { t: 'Privacy Policy', d: 'How we collect, use, and protect your personal medical data.', icon: Gavel },
  { t: 'Regulatory Disclaimers', d: 'HIPAA compliance information and medical accuracy notices.', icon: ShieldCheck },
]

const quick = [
  { t: 'Contact Support', icon: CircleHelp },
  { t: 'FAQs', icon: FileQuestion },
  { t: 'Terms of Service', icon: Gavel },
  { t: 'Privacy Policy', icon: ShieldQuestion },
  { t: 'Regulatory Disclaimers', icon: FileText },
]

const box = 'rounded-3xl border border-gray-100 bg-white shadow-card'

export default function Help() {
  return (
    <div>
      <PageHeader
        title="Help & Legal"
        subtitle="Access support resources, read our legal documentation, and manage your data preferences in accordance with healthcare regulations."
      />

      <div className="grid grid-cols-2 gap-6">
        <div className={`${box} p-7`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-ink">
            <Headset className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold">Contact Support</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Connect with our dedicated medical concierge team for assistance with your portal or health data queries.
          </p>
          <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
            Submit a ticket <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className={`${box} p-7`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <FileQuestion className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold">FAQs</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Find quick answers to common questions about appointments, laboratory results, and prescription refills.
          </p>
          <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
            Browse articles <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_380px] gap-6">
        <div className={`${box} p-7`}>
          <h3 className="border-b border-gray-100 pb-5 text-xl font-semibold">Legal &amp; Compliance</h3>
          <div className="mt-2">
            {legal.map((l) => (
              <a key={l.t} href="#" className="flex items-center justify-between py-6">
                <div className="flex items-center gap-4">
                  <l.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-[17px] font-semibold">{l.t}</p>
                    <p className="text-xs text-gray-600">{l.d}</p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-500" />
              </a>
            ))}
          </div>
        </div>

        <div className={`${box} p-6`}>
          <h3 className="flex items-center gap-3 text-[17px] font-semibold">
            <CircleHelp className="h-5 w-5 text-brand-500" /> Quick Access
          </h3>
          <ul className="mt-4">
            {quick.map((q) => (
              <li key={q.t}>
                <a href="#" className="flex items-center justify-between py-4 text-xs text-gray-800">
                  <span className="flex items-center gap-2">
                    <q.icon className="h-4 w-4" /> {q.t}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 border-t border-gray-200 pt-5 text-center text-[9px] font-semibold uppercase tracking-wide text-gray-500">
            App Version 3.2.1 Build 431
          </p>
        </div>
      </div>
    </div>
  )
}
