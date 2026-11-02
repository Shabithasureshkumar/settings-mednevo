import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import type { SectionKey } from './Sidebar'

/* ---------------- Shared button styles ---------------- */
export const btnPrimary =
  'rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-brand disabled:cursor-not-allowed disabled:opacity-60'
export const btnGhost =
  'rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60'
export const btnDanger = 'rounded-xl bg-danger px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'

/* ---------------- App-level actions (navigation, sign out) ---------------- */
interface AppActions {
  go: (key: SectionKey) => void
  signOut: () => void
}
export const AppCtx = createContext<AppActions>({ go: () => {}, signOut: () => {} })
export const useApp = () => useContext(AppCtx)

/* ---------------- Toasts ---------------- */
type ToastKind = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  msg: string
  kind: ToastKind
}

const ToastCtx = createContext<(msg: string, kind?: ToastKind) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

const toastIcon = { success: CircleCheck, error: CircleAlert, info: Info }
const toastTone = { success: 'text-green-400', error: 'text-red-400', info: 'text-brand-200' }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const push = useCallback((msg: string, kind: ToastKind = 'success') => {
    const id = ++nextId.current
    setItems((p) => [...p.slice(-2), { id, msg, kind }])
    window.setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2">
        {items.map((t) => {
          const Icon = toastIcon[t.kind]
          return (
            <div key={t.id} className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-xl">
              <Icon className={`h-4 w-4 shrink-0 ${toastTone[t.kind]}`} />
              {t.msg}
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------------- Modal ---------------- */
export function Modal({
  title,
  onClose,
  children,
  footer,
  width = 'max-w-md',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative max-h-[85vh] w-full ${width} overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

/* ---------------- Confirm dialog (optionally requires typing a word) ---------------- */
export function ConfirmModal({
  title,
  message,
  confirmLabel,
  danger,
  requireText,
  onConfirm,
  onClose,
}: {
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  requireText?: string
  onConfirm: () => void
  onClose: () => void
}) {
  const [typed, setTyped] = useState('')
  const ok = !requireText || typed === requireText

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={danger ? btnDanger : btnPrimary}
            disabled={!ok}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-6 text-gray-600">{message}</p>
      {requireText && (
        <label className="mt-4 block">
          <span className="mb-2 block text-xs text-gray-700">
            Type <b>{requireText}</b> to confirm
          </span>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} className={inputCls} autoFocus />
        </label>
      )}
    </Modal>
  )
}

/* ---------------- Form field ---------------- */
export const inputCls =
  'h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-200'

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-gray-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

/* ---------------- File download helper ---------------- */
export function downloadText(filename: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
