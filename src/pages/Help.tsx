import { useState } from 'react'
import { ArrowRight, ChevronRight, CircleHelp, FileQuestion, FileText, Gavel, Headset, ShieldCheck, ExternalLink, ShieldQuestion } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { Field, Modal, btnGhost, btnPrimary, inputCls, useToast } from '../components/feedback'

const legal = [
  { t: 'Terms of Service', d: 'The contractual agreement for using HealthCore services.', icon: FileText },
  { t: 'Privacy Policy', d: 'How we collect, use, and protect your personal medical data.', icon: Gavel },
  { t: 'Regulatory Disclaimers', d: 'HIPAA compliance information and medical accuracy notices.', icon: ShieldCheck },
]

const docs: Record<string, string[]> = {
  'Terms of Service': [
    'By using HealthCore you agree to use the portal only for managing your own health information.',
    'You are responsible for keeping your sign-in details confidential and for activity under your account.',
    'We may update these terms; continued use after an update means you accept the revised terms.',
  ],
  'Privacy Policy': [
    'We collect only the health and account data needed to provide your care services.',
    'Your data is encrypted in transit and at rest, and is shared with your care team only with your consent.',
    'You can export or delete your data at any time from the Data section of Settings.',
  ],
  'Regulatory Disclaimers': [
    'HealthCore follows HIPAA requirements for protecting personal health information.',
    'Information in this portal supports, but does not replace, advice from a qualified medical professional.',
    'In an emergency, contact your local emergency services immediately.',
  ],
}

const faqs = [
  { q: 'How do I reschedule an appointment?', a: 'Open Appointments from your dashboard, select the booking and choose Reschedule.' },
  { q: 'Where can I find my lab results?', a: 'New results appear under Reports as soon as your lab publishes them, and you will get a notification.' },
  { q: 'How do I request a prescription refill?', a: 'Open the medication in your records and select Request refill. Your care team reviews it within one business day.' },
  { q: 'How do I export my health data?', a: 'Go to Settings, then Data, and choose Request data export. A download link is emailed within 24 hours.' },
]

type Dialog = null | { kind: 'ticket' } | { kind: 'faq' } | { kind: 'doc'; title: string }

const quick: { t: string; icon: typeof CircleHelp; open: Dialog }[] = [
  { t: 'Contact Support', icon: CircleHelp, open: { kind: 'ticket' } },
  { t: 'FAQs', icon: FileQuestion, open: { kind: 'faq' } },
  { t: 'Terms of Service', icon: Gavel, open: { kind: 'doc', title: 'Terms of Service' } },
  { t: 'Privacy Policy', icon: ShieldQuestion, open: { kind: 'doc', title: 'Privacy Policy' } },
  { t: 'Regulatory Disclaimers', icon: FileText, open: { kind: 'doc', title: 'Regulatory Disclaimers' } },
]

const box = 'rounded-3xl border border-gray-100 bg-white shadow-card'

function TicketModal({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({})

  const submit = () => {
    const e: typeof errors = {}
    if (!subject.trim()) e.subject = 'Please add a subject.'
    if (message.trim().length < 10) e.message = 'Describe the issue in at least 10 characters.'
    setErrors(e)
    if (Object.keys(e).length) return
    toast(`Ticket #${Math.floor(10000 + Math.random() * 90000)} submitted. We will reply by email.`)
    onClose()
  }

  return (
    <Modal
      title="Submit a ticket"
      onClose={onClose}
      footer={
        <>
          <button className={btnGhost} onClick={onClose}>Cancel</button>
          <button className={btnPrimary} onClick={submit}>Submit</button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Subject" error={errors.subject}>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={80} className={inputCls} autoFocus />
        </Field>
        <Field label="How can we help?" error={errors.message}>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={1000} className={`${inputCls} h-auto py-3`} />
        </Field>
      </div>
    </Modal>
  )
}

export default function Help() {
  const [dialog, setDialog] = useState<Dialog>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const close = () => setDialog(null)

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
          <button onClick={() => setDialog({ kind: 'ticket' })} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
            Submit a ticket <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className={`${box} p-7`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <FileQuestion className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold">FAQs</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Find quick answers to common questions about appointments, laboratory results, and prescription refills.
          </p>
          <button onClick={() => setDialog({ kind: 'faq' })} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
            Browse articles <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_380px] gap-6">
        <div className={`${box} p-7`}>
          <h3 className="border-b border-gray-100 pb-5 text-xl font-semibold">Legal &amp; Compliance</h3>
          <div className="mt-2">
            {legal.map((l) => (
              <button
                key={l.t}
                onClick={() => setDialog({ kind: 'doc', title: l.t })}
                className="flex w-full items-center justify-between py-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <l.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-[17px] font-semibold">{l.t}</p>
                    <p className="text-xs text-gray-600">{l.d}</p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-500" />
              </button>
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
                <button onClick={() => setDialog(q.open)} className="flex w-full items-center justify-between py-4 text-xs text-gray-800">
                  <span className="flex items-center gap-2">
                    <q.icon className="h-4 w-4" /> {q.t}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 border-t border-gray-200 pt-5 text-center text-[9px] font-semibold uppercase tracking-wide text-gray-500">
            App Version 3.2.1 Build 431
          </p>
        </div>
      </div>

      {dialog?.kind === 'ticket' && <TicketModal onClose={close} />}

      {dialog?.kind === 'faq' && (
        <Modal title="Frequently asked questions" onClose={close} width="max-w-lg" footer={<button className={btnGhost} onClick={close}>Close</button>}>
          <ul className="divide-y divide-gray-100">
            {faqs.map((f, i) => (
              <li key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold"
                >
                  {f.q}
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && <p className="pb-4 text-sm leading-6 text-gray-600">{f.a}</p>}
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {dialog?.kind === 'doc' && (
        <Modal title={dialog.title} onClose={close} width="max-w-lg" footer={<button className={btnGhost} onClick={close}>Close</button>}>
          <div className="space-y-3 text-sm leading-6 text-gray-600">
            {docs[dialog.title].map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
