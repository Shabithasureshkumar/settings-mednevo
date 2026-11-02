import {
  Bell,
  CalendarDays,
  Camera,
  CircleHelp,
  CircleUserRound,
  ClipboardList,
  Globe,
  Loader,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  ShieldHalf,
  ShieldPlus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import patientAvatar from '../assets/patient-avatar.webp'

export type SectionKey =
  | 'account'
  | 'notifications'
  | 'privacy'
  | 'audit'
  | 'devices'
  | 'language'
  | 'insurance'
  | 'data'
  | 'period'
  | 'help'

export const navItems: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: 'account', label: 'Account', icon: CircleUserRound },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy', icon: ShieldHalf },
  { key: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { key: 'devices', label: 'Devices', icon: MonitorSmartphone },
  { key: 'language', label: 'Language', icon: Globe },
  { key: 'insurance', label: 'Insurance', icon: ShieldPlus },
  { key: 'data', label: 'Data', icon: Loader },
  { key: 'period', label: 'Period Tracker', icon: CalendarDays },
  { key: 'help', label: 'Help', icon: CircleHelp },
]

interface SidebarProps {
  active: SectionKey
  onChange: (key: SectionKey) => void
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="relative flex w-[390px] shrink-0 flex-col rounded-tr-[40px] bg-brand-gradient-v pb-10">
      {/* Profile card */}
      <div className="rounded-[36px] rounded-tl-none border-b border-white/20 bg-white/20 px-9 pb-9 pt-8 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={patientAvatar}
              alt="Sarah Johnson"
              className="h-[104px] w-[104px] rounded-full border-[3px] border-white/80 object-cover"
            />
            <span className="absolute bottom-1 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 ring-2 ring-white/60">
              <Camera className="h-3.5 w-3.5 text-white" />
            </span>
          </div>
          <div className="text-white">
            <h2 className="text-[22px] font-bold">Sarah Johnson</h2>
            <span className="mt-2 inline-block rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm text-white/90">
              Patient ID: P-98765
            </span>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-white/90">
              <ShieldCheck className="h-4 w-4" /> Member since April 2026
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="rounded-xl bg-white py-3 text-sm font-semibold text-brand-500">Upload Photo</button>
          <button className="rounded-xl border border-white/30 bg-white/25 py-3 text-sm font-medium text-white">
            Remove
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex flex-col gap-1 pl-8">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = key === active
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-6 rounded-l-2xl px-7 py-[14px] text-left text-[18px] font-medium transition-colors ${
                isActive ? 'bg-white text-brand-500' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="mx-8 mt-10 border-t border-white/15" />

      <button className="mt-8 flex items-center gap-4 px-14 text-[18px] font-medium text-rose-600">
        <LogOut className="h-5 w-5" /> Logout
      </button>
    </aside>
  )
}
