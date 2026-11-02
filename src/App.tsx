import { useState, type ComponentType } from 'react'
import TopNav from './components/TopNav'
import Sidebar, { type SectionKey } from './components/Sidebar'
import Account from './pages/Account'
import Notifications from './pages/Notifications'
import Privacy from './pages/Privacy'
import AuditLogs from './pages/AuditLogs'
import Devices from './pages/Devices'
import Language from './pages/Language'
import Insurance from './pages/Insurance'
import DataManagement from './pages/DataManagement'
import PeriodTracker from './pages/PeriodTracker'
import Help from './pages/Help'

const pages: Record<SectionKey, ComponentType> = {
  account: Account,
  notifications: Notifications,
  privacy: Privacy,
  audit: AuditLogs,
  devices: Devices,
  language: Language,
  insurance: Insurance,
  data: DataManagement,
  period: PeriodTracker,
  help: Help,
}

export default function App() {
  const [active, setActive] = useState<SectionKey>('account')
  const Page = pages[active]

  return (
    <div className="flex min-h-screen min-w-[1440px] flex-col bg-white">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar active={active} onChange={setActive} />
        <main className="flex-1 px-12 pb-12 pt-4">
          <Page />
        </main>
      </div>
    </div>
  )
}
