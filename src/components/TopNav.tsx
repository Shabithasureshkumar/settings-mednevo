import { Bell, LayoutGrid, Search, Settings } from 'lucide-react'
import doctorAvatar from '../assets/doctor-avatar.webp'

const links = ['Appointment', 'Patient', 'Reports', 'Chats', 'Billing']

export default function TopNav() {
  return (
    <header className="flex h-[88px] items-center justify-between bg-white px-6">
      <nav className="flex items-center gap-2 rounded-full border border-gray-100 bg-white p-1.5 pr-6 shadow-[0_2px_12px_rgba(17,12,46,0.04)]">
        <button className="flex items-center gap-3 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white">
          <LayoutGrid className="h-5 w-5" fill="currentColor" strokeWidth={0} />
          Dashboard
        </button>
        {links.map((l) => (
          <a key={l} href="#" className="px-5 text-[15px] font-semibold text-gray-900 hover:text-brand-500">
            {l}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200/80 text-gray-800">
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <button className="text-gray-500">
          <Settings className="h-6 w-6" fill="currentColor" stroke="white" strokeWidth={1.5} />
        </button>
        <button className="text-gray-500">
          <Bell className="h-6 w-6" fill="currentColor" />
        </button>
        <div className="flex items-center gap-3">
          <img src={doctorAvatar} alt="David Brock" className="h-11 w-11 rounded-full bg-gray-50 object-cover" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900">David Brock</p>
            <p className="text-xs text-gray-400">General Physician</p>
          </div>
        </div>
      </div>
    </header>
  )
}
