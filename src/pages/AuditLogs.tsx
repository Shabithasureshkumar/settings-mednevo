import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  Globe,
  Layers,
  MonitorSmartphone,
  RotateCcw,
  Search,
  User,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/ui'
import { fetchAuditLogs, type AuditLog, type AuditStatus } from '../services/auditLogs'

/* ---------- helpers ---------- */
const statusStyle: Record<AuditStatus, { label: string; cls: string; dot: string }> = {
  success: { label: 'Success', cls: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
  failed: { label: 'Failed', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  warning: { label: 'Review', cls: 'bg-orange-50 text-orange-500', dot: 'bg-orange-400' },
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
const unique = (arr: string[]) => Array.from(new Set(arr)).sort()

function exportCsv(rows: AuditLog[]) {
  const head = ['ID', 'User', 'Email', 'Action', 'Module', 'Date & Time', 'Status', 'Previous Value', 'New Value', 'IP Address']
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const body = rows.map((r) =>
    [r.id, r.user.name, r.user.email, r.action, r.module, r.timestamp, r.status, r.previousValue, r.newValue, r.ipAddress].map(esc).join(','),
  )
  const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ---------- small UI pieces ---------- */
const fieldCls =
  'h-12 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-brand-200 focus:ring-2 focus:ring-brand-100'

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-gray-500">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldCls} appearance-none pr-10`}>
          <option value="">All</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </label>
  )
}

function StatusPill({ status }: { status: AuditStatus }) {
  const s = statusStyle[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-ink">
      {initials(name)}
    </span>
  )
}

/* ---------- details drawer ---------- */
function DetailsDrawer({ log, onClose }: { log: AuditLog | null; onClose: () => void }) {
  useEffect(() => {
    if (!log) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [log, onClose])

  const open = Boolean(log)

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#5C24FF]/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Audit log details"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl transition-transform duration-300 sm:rounded-l-[32px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {log && (
          <>
            <div className="flex items-start justify-between border-b border-gray-100 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-ink">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{log.id}</p>
                  <h2 className="text-xl font-bold">{log.action}</h2>
                </div>
              </div>
              <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              <div className="flex items-center justify-between">
                <StatusPill status={log.status} />
                <span className="text-xs text-gray-400">{fmtDate(log.timestamp)} · {fmtTime(log.timestamp)}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{log.description}</p>

              <dl className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-100">
                {[
                  { icon: ClipboardList, label: 'Action Performed', value: log.action },
                  { icon: User, label: 'Performed By', value: `${log.user.name} · ${log.user.role}`, sub: log.user.email },
                  { icon: CalendarRange, label: 'Date & Time', value: `${fmtDate(log.timestamp)}, ${fmtTime(log.timestamp)}` },
                  { icon: Layers, label: 'Affected Module', value: log.module },
                  ...(log.ipAddress ? [{ icon: Globe, label: 'IP Address', value: log.ipAddress }] : []),
                  ...(log.device ? [{ icon: MonitorSmartphone, label: 'Device', value: log.device }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4 px-5 py-4">
                    <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" />
                    <div className="min-w-0">
                      <dt className="text-xs text-gray-400">{row.label}</dt>
                      <dd className={`mt-0.5 break-words text-sm font-semibold text-gray-800 ${row.label === 'IP Address' ? 'font-mono font-medium' : ''}`}>
                        {row.value}
                      </dd>
                      {'sub' in row && row.sub && <dd className="text-xs text-gray-500">{row.sub}</dd>}
                    </div>
                  </div>
                ))}
              </dl>

              <h3 className="mt-7 text-sm font-semibold text-gray-800">Change Details</h3>
              {log.previousValue || log.newValue ? (
                <div className="mt-3 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-red-500">Previous Value</p>
                    <p className="mt-2 break-words text-sm text-gray-700">{log.previousValue ?? '—'}</p>
                  </div>
                  <div className="hidden items-center justify-center sm:flex">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-green-600">New Value</p>
                    <p className="mt-2 break-words text-sm text-gray-700">{log.newValue ?? '—'}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-500">No value changes recorded for this event.</p>
              )}
            </div>

            <div className="border-t border-gray-100 px-7 py-5">
              <button onClick={onClose} className="w-full rounded-2xl bg-brand-gradient py-3.5 text-sm font-semibold text-white shadow-brand">
                Close
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

/* ---------- page ---------- */
const PAGE_SIZE = 8

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'api' | 'sample'>('sample')

  const [query, setQuery] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [user, setUser] = useState('')
  const [action, setAction] = useState('')
  const [module, setModule] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<AuditLog | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAuditLogs(ctrl.signal)
      .then((r) => {
        setLogs(r.logs)
        setSource(r.source)
      })
      .catch(() => undefined)
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  const users = useMemo(() => unique(logs.map((l) => l.user.name)), [logs])
  const actions = useMemo(() => unique(logs.map((l) => l.action)), [logs])
  const modules = useMemo(() => unique(logs.map((l) => l.module)), [logs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity
    const toTs = to ? new Date(`${to}T23:59:59`).getTime() : Infinity
    return logs
      .filter((l) => {
        const t = new Date(l.timestamp).getTime()
        if (t < fromTs || t > toTs) return false
        if (user && l.user.name !== user) return false
        if (action && l.action !== action) return false
        if (module && l.module !== module) return false
        if (!q) return true
        return [l.id, l.user.name, l.user.email, l.action, l.module, l.description, l.ipAddress ?? '']
          .some((v) => v.toLowerCase().includes(q))
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [logs, query, from, to, user, action, module])

  useEffect(() => setPage(1), [query, from, to, user, action, module])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = Boolean(query || from || to || user || action || module)

  const reset = () => {
    setQuery(''); setFrom(''); setTo(''); setUser(''); setAction(''); setModule('')
  }

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Track and review user and system activities."
        right={
          <button
            onClick={() => exportCsv(filtered)}
            disabled={!filtered.length}
            className="flex shrink-0 items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-medium text-white shadow-btn disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        }
      />

      {/* Filters */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <label className="block sm:col-span-2 lg:col-span-3 2xl:col-span-2">
            <span className="mb-2 block text-xs text-gray-500">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by user, action, module or IP…"
                className={`${fieldCls} pl-11`}
              />
            </div>
          </label>
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-xs text-gray-500">Date Range</span>
            <div className="flex items-center gap-2">
              <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={`${fieldCls} px-3`} aria-label="From date" />
              <span className="text-xs text-gray-400">to</span>
              <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={`${fieldCls} px-3`} aria-label="To date" />
            </div>
          </div>
          <FilterSelect label="User" value={user} onChange={setUser} options={users} />
          <FilterSelect label="Action" value={action} onChange={setAction} options={actions} />
          <FilterSelect label="Module" value={module} onChange={setModule} options={modules} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of {logs.length} records
            {source === 'sample' && !loading && <span className="ml-2 rounded-full bg-brand-50 px-2.5 py-0.5 font-medium text-brand-ink">Sample data</span>}
          </span>
          {hasFilters && (
            <button onClick={reset} className="flex items-center gap-1.5 font-semibold text-brand-ink">
              <RotateCcw className="h-3.5 w-3.5" /> Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Module</th>
                <th className="px-6 py-4 font-medium">Date &amp; Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-5">
                        <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading &&
                rows.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="cursor-pointer transition-colors hover:bg-brand-50/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.user.name} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{l.user.name}</p>
                          <p className="truncate text-xs text-gray-400">{l.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">{l.action}</p>
                      <p className="max-w-[240px] truncate text-xs text-gray-400">{l.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{l.module}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">{fmtDate(l.timestamp)}</p>
                      <p className="text-xs text-gray-400">{fmtTime(l.timestamp)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={l.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected(l)
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-brand-ink hover:border-brand-200 hover:bg-brand-50"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-ink">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-800">No audit logs found</p>
                    <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
            <span>
              Page {page} of {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-9 min-w-9 rounded-xl px-3 text-xs font-semibold ${
                    n === page ? 'bg-brand-gradient text-white' : 'border border-gray-200 text-gray-600'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <DetailsDrawer log={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
