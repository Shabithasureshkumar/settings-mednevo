import { useEffect, useMemo, useState, type ComponentType } from 'react'
import TopNav from './components/TopNav'
import Sidebar, { type SectionKey } from './components/Sidebar'
import { AppCtx, ToastProvider, btnPrimary } from './components/feedback'
import Account from './pages/Account'
import Notifications from './pages/Notifications'
import Privacy from './pages/Privacy'
import AuditLogs from './pages/AuditLogs'
import Devices from './pages/Devices'
import Language, { applyAccessibility, loadAccessibility } from './pages/Language'
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
  const [signedOut, setSignedOut] = useState(false)
  const Page = pages[active]

  useEffect(() => applyAccessibility(loadAccessibility()), [])

  const actions = useMemo(
    () => ({
      go: (key: SectionKey) => {
        setActive(key)
        window.scrollTo({ top: 0 })
      },
      signOut: () => setSignedOut(true),
    }),
    [],
  )

  return (
    <ToastProvider>
      <AppCtx.Provider value={actions}>
        {signedOut ? (
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="rounded-3xl bg-white p-10 text-center shadow-card">
              <h1 className="text-2xl font-bold">You have been signed out</h1>
              <p className="mt-2 text-sm text-gray-500">Sign in again to continue managing your settings.</p>
              <button
                className={`${btnPrimary} mt-6`}
                onClick={() => {
                  setSignedOut(false)
                  setActive('account')
                }}
              >
                Sign back in
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-screen min-w-[1440px] flex-col bg-white">
            <TopNav />
            <div className="flex flex-1">
              <Sidebar active={active} onChange={setActive} />
              <main className="flex-1 px-12 pb-12 pt-4">
                <Page />
              </main>
            </div>
          </div>
        )}
      </AppCtx.Provider>
    </ToastProvider>
  )
}
