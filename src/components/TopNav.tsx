import { useState } from 'react'
import { Bell, LayoutGrid, Search, Settings } from 'lucide-react'
import doctorAvatar from '../assets/doctor-avatar.webp'
import { Modal, inputCls, useApp, useToast } from './feedback'
import { navItems } from './Sidebar'

const links = ['Appointment', 'Patient', 'Reports', 'Chats', 'Billing']

const alerts = [
  { t: 'Appointment Confirmation', d: 'Sent via Push & Email • 2h ago' },
  { t: 'New Lab Result Ready', d: 'Sent via Push • 5h ago' },
  { t: 'Low Battery Warning', d: 'Pulse Oximeter battery is below 15% • Yesterday' },
]

export default function TopNav() {
  const { go } = useApp()
  const toast = useToast()
  const [panel, setPanel] = useState<'search' | 'alerts' | null>(null)
  const [query, setQuery] = useState('')

  const results = navItems.filter((n) => n.label.toLowerCase().includes(query.trim().toLowerCase()))
  const close = () => {
    setPanel(null)
    setQuery('')
  }

  return (
    <header className="flex h-[88px] items-center justify-between bg-white px-6">
      <nav className="flex items-center gap-2 rounded-full border border-gray-100 bg-white p-1.5 pr-6 shadow-[0_2px_12px_rgba(17,12,46,0.04)]">
        <button
          onClick={() => go('account')}
          className="flex items-center gap-3 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white"
        >
          <LayoutGrid className="h-5 w-5" fill="currentColor" strokeWidth={0} />
          Dashboard
        </button>
        {links.map((l) => (
          <button
            key={l}
            onClick={() => toast(`${l} is not part of the settings portal.`, 'info')}
            className="px-5 text-[15px] font-semibold text-gray-900 hover:text-brand-500"
          >
            {l}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <button
          aria-label="Search settings"
          onClick={() => setPanel('search')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200/80 text-gray-800"
        >
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <button aria-label="Settings" onClick={() => go('account')} className="text-gray-500">
          <Settings className="h-6 w-6" fill="currentColor" stroke="white" strokeWidth={1.5} />
        </button>
        <button aria-label="Notifications" onClick={() => setPanel('alerts')} className="relative text-gray-500">
          <Bell className="h-6 w-6" fill="currentColor" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3">
          <img src={doctorAvatar} alt="David Brock" className="h-11 w-11 rounded-full bg-gray-50 object-cover" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900">David Brock</p>
            <p className="text-xs text-gray-400">General Physician</p>
          </div>
        </div>
      </div>

      {panel === 'search' && (
        <Modal title="Search settings" onClose={close}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Privacy, Devices, Insurance"
            className={inputCls}
          />
          <ul className="mt-3">
            {results.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  onClick={() => {
                    go(key)
                    close()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-800 hover:bg-brand-50"
                >
                  <Icon className="h-4 w-4 text-brand-500" /> {label}
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="px-3 py-3 text-sm text-gray-500">No settings match “{query}”.</li>}
          </ul>
        </Modal>
      )}

      {panel === 'alerts' && (
        <Modal title="Recent alerts" onClose={close}>
          <ul className="space-y-4">
            {alerts.map((a) => (
              <li key={a.t} className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-sm font-semibold">{a.t}</p>
                <p className="text-xs text-gray-500">{a.d}</p>
              </li>
            ))}
          </ul>
          <button
            className="mt-5 text-sm font-semibold text-brand-ink"
            onClick={() => {
              go('notifications')
              close()
            }}
          >
            Manage notification preferences
          </button>
        </Modal>
      )}
    </header>
  )
}
