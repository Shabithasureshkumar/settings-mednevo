import { CircleCheck, CirclePlus, Download, FileText, IdCard, MoreVertical, RefreshCw, Settings, Shield, Star, Wallet, Zap } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/ui'
import { ConfirmModal, Field, Modal, btnGhost, btnPrimary, downloadText, inputCls, useToast } from '../components/feedback'

const box = 'rounded-3xl border border-gray-100 bg-white shadow-card'

interface Card {
  id: number
  brand: 'Mastercard' | 'Visa'
  last4: string
  exp: string
}

const plans = [
  { name: 'BlueShield Plus', note: 'Primary • 90% coverage', current: true },
  { name: 'BlueShield Basic', note: '70% coverage • lower premium', current: false },
  { name: 'BlueShield Premier', note: '100% coverage • no deductible', current: false },
]

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

type Dialog = null | 'funds' | 'wallet' | 'pay' | 'card' | 'plans' | 'addCard' | { menu: number }

export default function Insurance() {
  const toast = useToast()
  const [dialog, setDialog] = useState<Dialog>(null)
  const [balance, setBalance] = useState(245.5)
  const [outstanding, setOutstanding] = useState(15)
  const [autoReload, setAutoReload] = useState(false)
  const [reloadAmount, setReloadAmount] = useState('50')
  const [applePay, setApplePay] = useState(false)
  const [cards, setCards] = useState<Card[]>([
    { id: 1, brand: 'Mastercard', last4: '9823', exp: '09/26' },
    { id: 2, brand: 'Visa', last4: '1104', exp: '12/25' },
  ])
  const [defaultId, setDefaultId] = useState(1)
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [newCard, setNewCard] = useState({ number: '', exp: '' })
  const [cardErrors, setCardErrors] = useState<{ number?: string; exp?: string }>({})
  const close = () => setDialog(null)

  const defaultCard = cards.find((c) => c.id === defaultId)
  const [firstCard, ...otherCards] = [...cards].sort((a, b) => (a.id === defaultId ? -1 : b.id === defaultId ? 1 : 0))

  const addFunds = () => {
    const n = Number(amount)
    if (!amount || Number.isNaN(n) || n < 5 || n > 5000) return setAmountError('Enter an amount between $5 and $5,000.')
    setBalance((b) => b + n)
    setAmount('')
    setAmountError('')
    close()
    toast(`${money(n)} added to your balance.`)
  }

  const pay = () => {
    if (balance < outstanding) {
      close()
      return toast('Insufficient balance. Add funds first.', 'error')
    }
    setBalance((b) => b - outstanding)
    setOutstanding(0)
    close()
    toast('Payment successful. Outstanding balance is now $0.00.')
  }

  const addCard = () => {
    const digits = newCard.number.replace(/\D/g, '')
    const e: typeof cardErrors = {}
    if (digits.length < 13 || digits.length > 19) e.number = 'Enter a valid card number.'
    const m = /^(\d{2})\/(\d{2})$/.exec(newCard.exp.trim())
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.exp = 'Use MM/YY.'
    else {
      const now = new Date()
      const yy = now.getFullYear() % 100
      if (Number(m[2]) < yy || (Number(m[2]) === yy && Number(m[1]) < now.getMonth() + 1)) e.exp = 'This card has expired.'
    }
    setCardErrors(e)
    if (Object.keys(e).length || !m) return
    const last4 = digits.slice(-4)
    if (cards.some((c) => c.last4 === last4)) return setCardErrors({ number: 'This card is already saved.' })
    const id = Math.max(0, ...cards.map((c) => c.id)) + 1
    setCards([...cards, { id, brand: digits.startsWith('4') ? 'Visa' : 'Mastercard', last4, exp: newCard.exp.trim() }])
    setNewCard({ number: '', exp: '' })
    close()
    toast(`Card ending ${last4} added.`)
  }

  const removeCard = (id: number) => {
    if (cards.length === 1) return toast('You need at least one payment method.', 'error')
    const rest = cards.filter((c) => c.id !== id)
    setCards(rest)
    if (defaultId === id) setDefaultId(rest[0].id)
    toast('Payment method removed.', 'info')
  }

  const downloadDoc = (name: string) => {
    downloadText(
      `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`,
      `${name}\nPatient: Sarah Johnson\nPolicy ID: BS-9923-441\nGenerated: ${new Date().toISOString().slice(0, 10)}\n`,
    )
    toast(`${name} downloaded.`)
  }

  const logo = (c: Card) =>
    c.brand === 'Visa' ? (
      <div className="flex h-8 w-14 items-center justify-center rounded bg-[#1A1F71] text-[10px] font-bold italic text-white">VISA</div>
    ) : (
      <div className="flex h-8 w-14 items-center justify-center rounded-md bg-black">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="-ml-1 h-3 w-3 rounded-full bg-yellow-400/90" />
      </div>
    )

  const cardView = (c: Card, isDefault: boolean) =>
    isDefault ? (
      <div key={c.id} className="mt-6 flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
        {logo(c)}
        <div className="flex-1">
          <p className="text-sm font-semibold">{c.brand} •••• {c.last4}</p>
          <p className="text-xs text-gray-500">Exp {c.exp}</p>
        </div>
        <span className="rounded bg-brand-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white">Default</span>
      </div>
    ) : (
      <div key={c.id} className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
        {logo(c)}
        <div className="flex-1">
          <p className="text-sm font-semibold">{c.brand} •••• {c.last4}</p>
          <p className="text-xs text-gray-500">Exp {c.exp}</p>
        </div>
        <button aria-label={`Options for card ending ${c.last4}`} onClick={() => setDialog({ menu: c.id })}>
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    )

  const menuCard = typeof dialog === 'object' && dialog ? cards.find((c) => c.id === dialog.menu) : undefined

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
              <p className="mt-1 text-[34px] font-bold leading-tight">{money(balance)}</p>
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
            <button
              onClick={() => { setAmount(''); setAmountError(''); setDialog('funds') }}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-brand-ink"
            >
              <CirclePlus className="h-4 w-4" /> Add Funds
            </button>
            <button
              aria-pressed={autoReload}
              onClick={() => {
                setAutoReload(!autoReload)
                toast(autoReload ? 'Auto reload turned off.' : `Auto reload on: tops up $${reloadAmount} when balance is low.`, autoReload ? 'info' : 'success')
              }}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold ${autoReload ? 'bg-white text-brand-ink' : 'bg-white/20 text-white/90'}`}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Auto Reload {autoReload ? 'On' : 'Off'}
            </button>
            <button aria-label="Wallet settings" onClick={() => setDialog('wallet')} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
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
              <dd className={`font-semibold ${outstanding ? 'text-red-600' : 'text-green-600'}`}>{money(outstanding)}</dd>
            </div>
          </dl>
          <button
            onClick={() => setDialog('pay')}
            disabled={outstanding === 0}
            className="mt-7 w-full rounded-2xl bg-brand-gradient py-3.5 text-[17px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {outstanding === 0 ? 'Paid' : 'Pay Now'}
          </button>
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
              <button key={d} onClick={() => downloadDoc(d)} className="flex w-full items-center justify-between rounded-2xl bg-gray-100 px-5 py-4 text-sm font-semibold text-gray-800">
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
            <button onClick={() => setDialog('card')} className="rounded-2xl border border-gray-800 px-6 py-3 text-sm font-semibold">View Card</button>
            <button onClick={() => setDialog('plans')} className="rounded-2xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-600">All Plans</button>
          </div>
        </div>

        {/* Payment methods */}
        <div className={`${box} p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] text-gray-800">Payment Methods</h3>
            <button
              onClick={() => { setNewCard({ number: '', exp: '' }); setCardErrors({}); setDialog('addCard') }}
              className="text-sm font-semibold text-brand-500"
            >
              + Add New
            </button>
          </div>
          {firstCard && cardView(firstCard, firstCard.id === defaultId)}
          {otherCards.map((c) => cardView(c, false))}
          <button
            onClick={() => {
              setApplePay(!applePay)
              toast(applePay ? 'Apple Pay disconnected.' : 'Apple Pay connected.', applePay ? 'info' : 'success')
            }}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-100 py-3.5 text-sm font-semibold text-gray-600"
          >
            <span className="rounded border border-gray-500 px-1 text-[8px] font-bold">UPI</span> {applePay ? 'Apple Pay Connected' : 'Connect Apple Pay'}
          </button>
        </div>

        {/* Quick wallet */}
        <div className="h-fit rounded-3xl bg-brand-gradient-diag p-7 text-white shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">Quick Wallet</p>
              <p className="mt-1 text-[26px] font-bold">{money(balance)}</p>
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
            <button onClick={() => setDialog('wallet')} className="rounded-full bg-white/25 px-5 py-1.5 text-xs font-semibold">Manage</button>
          </div>
        </div>
      </div>

      {dialog === 'funds' && (
        <Modal
          title="Add funds"
          onClose={close}
          footer={
            <>
              <button className={btnGhost} onClick={close}>Cancel</button>
              <button className={btnPrimary} onClick={addFunds}>Add funds</button>
            </>
          }
        >
          <Field label="Amount (USD)" error={amountError}>
            <input
              value={amount}
              inputMode="decimal"
              autoFocus
              onChange={(e) => { setAmount(e.target.value); setAmountError('') }}
              onKeyDown={(e) => e.key === 'Enter' && addFunds()}
              placeholder="50.00"
              className={inputCls}
            />
          </Field>
          <p className="mt-3 text-xs text-gray-500">Charged to {defaultCard ? `${defaultCard.brand} ending ${defaultCard.last4}` : 'your default card'}.</p>
        </Modal>
      )}

      {dialog === 'wallet' && (
        <Modal title="Wallet settings" onClose={close} footer={<button className={btnPrimary} onClick={() => { close(); toast('Wallet settings saved.') }}>Done</button>}>
          <Field label="Auto reload amount">
            <select value={reloadAmount} onChange={(e) => setReloadAmount(e.target.value)} className={inputCls}>
              {['25', '50', '100', '200'].map((v) => (
                <option key={v} value={v}>${v}</option>
              ))}
            </select>
          </Field>
          <p className="mt-3 text-xs text-gray-500">Auto reload is currently {autoReload ? 'on' : 'off'}. Toggle it with the Auto Reload button.</p>
        </Modal>
      )}

      {dialog === 'pay' && (
        <ConfirmModal
          title="Pay outstanding balance"
          message={`Pay ${money(outstanding)} from your wallet balance of ${money(balance)}?`}
          confirmLabel={`Pay ${money(outstanding)}`}
          onConfirm={pay}
          onClose={close}
        />
      )}

      {dialog === 'card' && (
        <Modal title="Insurance card" onClose={close} footer={<button className={btnGhost} onClick={close}>Close</button>}>
          <div className="rounded-2xl bg-brand-gradient-diag p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-white/80">BlueShield Plus</p>
            <p className="mt-6 text-lg font-bold">Sarah Johnson</p>
            <p className="text-sm text-white/80">Policy ID: BS-9923-441</p>
            <p className="mt-4 text-xs text-white/80">Coverage 90% • Deductible $500.00 / $2,000.00</p>
          </div>
        </Modal>
      )}

      {dialog === 'plans' && (
        <Modal title="All plans" onClose={close} footer={<button className={btnGhost} onClick={close}>Close</button>}>
          <ul className="space-y-3">
            {plans.map((p) => (
              <li key={p.name} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.note}</p>
                </div>
                {p.current ? (
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase text-brand-500">Current</span>
                ) : (
                  <button onClick={() => { close(); toast(`Request to switch to ${p.name} sent to your insurer.`, 'info') }} className="text-sm font-semibold text-brand-ink">
                    Request
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {dialog === 'addCard' && (
        <Modal
          title="Add payment method"
          onClose={close}
          footer={
            <>
              <button className={btnGhost} onClick={close}>Cancel</button>
              <button className={btnPrimary} onClick={addCard}>Add card</button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Card number" error={cardErrors.number}>
              <input value={newCard.number} inputMode="numeric" maxLength={23} autoComplete="off" autoFocus onChange={(e) => setNewCard({ ...newCard, number: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Expiry (MM/YY)" error={cardErrors.exp}>
              <input value={newCard.exp} maxLength={5} placeholder="09/28" autoComplete="off" onChange={(e) => setNewCard({ ...newCard, exp: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </Modal>
      )}

      {menuCard && (
        <Modal title={`${menuCard.brand} •••• ${menuCard.last4}`} onClose={close} footer={<button className={btnGhost} onClick={close}>Close</button>}>
          <div className="flex flex-col gap-3">
            <button className={btnPrimary} onClick={() => { setDefaultId(menuCard.id); close(); toast('Default payment method updated.') }}>
              Set as default
            </button>
            <button className={btnGhost} onClick={() => { removeCard(menuCard.id); close() }}>
              Remove card
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
