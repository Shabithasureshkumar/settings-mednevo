import { CircleCheck, CirclePlus, Download, FileText, IdCard, MoreVertical, RefreshCw, Settings, Shield, Star, Wallet, Zap } from 'lucide-react'
import { PageHeader } from '../components/ui'

const box = 'rounded-3xl border border-gray-100 bg-white shadow-card'

export default function Insurance() {
  return (
    <div>
      <PageHeader
        title="Insurance & Billing"
        subtitle="Manage your insurance plans, payments, reimbursements, and healthcare finances in one secure place."
      />

      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-6">
        {/* Balance card */}
        <div className="rounded-3xl bg-brand-gradient-diag p-7 text-white shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-white/80">Total Available Balance</p>
              <p className="mt-1 text-[34px] font-bold leading-tight">$245.50</p>
            </div>
            <div className="rounded-xl bg-white/25 px-4 py-2.5">
              <p className="text-[8px] uppercase tracking-wide text-white/70">Health Points</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold">
                <Star className="h-3.5 w-3.5 text-yellow-300" fill="currentColor" /> 120 pts
              </p>
            </div>
          </div>
          <div className="mt-8 flex items-end gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] text-white/80">
                <span>Annual Benefit Usage</span>
                <span className="font-semibold text-white">65%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/25">
                <div className="h-full w-[65%] rounded-full bg-white/70" />
              </div>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-wide text-white/70">Pending Approval</p>
              <p className="text-sm font-semibold">$75.00</p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-brand-ink">
              <CirclePlus className="h-4 w-4" /> Add Funds
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-xs font-semibold text-white/90">
              <RefreshCw className="h-3.5 w-3.5" /> Auto Reload
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Financial summary */}
        <div className={`${box} p-7`}>
          <h3 className="text-[17px] text-gray-800">Financial Summary</h3>
          <dl className="mt-5 space-y-3 px-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Current Coverage</dt>
              <dd className="flex items-center gap-1 font-semibold text-green-600">
                <CircleCheck className="h-3.5 w-3.5" /> Fully Covered
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Next Due Date</dt>
              <dd className="font-semibold text-gray-900">Nov 01, 2023</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Outstanding Balance</dt>
              <dd className="font-semibold text-red-600">$15.00</dd>
            </div>
          </dl>
          <button className="mt-7 w-full rounded-2xl bg-brand-gradient py-3.5 text-[17px] font-semibold text-white">Pay Now</button>
        </div>

        {/* Tax documents */}
        <div className={`${box} p-7`}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-[17px] text-gray-800">Tax Documents</h3>
          </div>
          <p className="mt-6 text-sm leading-6 text-gray-600">
            Download your annual healthcare financial reports for tax filing.
          </p>
          <div className="mt-5 space-y-3">
            {['2023 Financial Summary', 'HSA Tax Form 1099-SA'].map((d) => (
              <button key={d} className="flex w-full items-center justify-between rounded-2xl bg-gray-100 px-5 py-4 text-sm font-semibold text-gray-800">
                <span className="flex-1 text-center">{d}</span>
                <Download className="h-4 w-4 text-brand-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Insurance overview */}
        <div className={`${box} p-7`}>
          <div className="flex items-start justify-between">
            <h3 className="text-[17px] leading-7 text-gray-800">
              Insurance
              <br />
              Overview
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase text-brand-500">
              <CircleCheck className="h-3 w-3" /> Primary
            </span>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-brand-500">
              <IdCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">BlueShield Plus</p>
              <p className="text-sm text-gray-500">Policy ID: BS-9923-441</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-600">Coverage</span>
            <span className="text-[17px] font-bold text-brand-500">90% Universal</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <span className="text-sm text-gray-600">Deductible</span>
            <span className="text-[17px] font-bold text-gray-900">$500.00 /$2,000.00</span>
          </div>
          <div className="mt-5 flex justify-center gap-4">
            <button className="rounded-2xl border border-gray-800 px-6 py-3 text-sm font-semibold">View Card</button>
            <button className="rounded-2xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-600">All Plans</button>
          </div>
        </div>

        {/* Payment methods */}
        <div className={`${box} p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] text-gray-800">Payment Methods</h3>
            <button className="text-sm font-semibold text-brand-500">+ Add New</button>
          </div>
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="-ml-1 h-3 w-3 rounded-full bg-yellow-400/90" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Mastercard•••• 9823</p>
              <p className="text-xs text-gray-500">Exp 09/26</p>
            </div>
            <span className="rounded bg-brand-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white">Default</span>
          </div>
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
            <div className="flex h-8 w-14 items-center justify-center rounded bg-[#1A1F71] text-[10px] font-bold italic text-white">
              VISA
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Visa •••• 1104</p>
              <p className="text-xs text-gray-500">Exp 12/25</p>
            </div>
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </div>
          <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-100 py-3.5 text-sm font-semibold text-gray-600">
            <span className="rounded border border-gray-500 px-1 text-[8px] font-bold">UPI</span> Connect Apple Pay
          </button>
        </div>

        {/* Quick wallet */}
        <div className="h-fit rounded-3xl bg-brand-gradient-diag p-7 text-white shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">Quick Wallet</p>
              <p className="mt-1 text-[26px] font-bold">$245.50</p>
            </div>
            <Wallet className="h-12 w-12 text-white/25" strokeWidth={1.5} />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/10">
                <Zap className="h-3.5 w-3.5" />
              </span>
              <span className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/10">
                <Shield className="h-3.5 w-3.5" />
              </span>
            </div>
            <button className="rounded-full bg-white/25 px-5 py-1.5 text-xs font-semibold">Manage</button>
          </div>
        </div>
      </div>
    </div>
  )
}
