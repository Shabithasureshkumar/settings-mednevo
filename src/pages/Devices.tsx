import { useState } from 'react'
import { BatteryLow, CircleAlert, CircleCheck, CirclePause, HeartPulse, MonitorSmartphone, Plus, Radio, RefreshCw, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import appleWatch from '../assets/apple-watch.png'
import bpMonitor from '../assets/bp-monitor.png'
import weightScale from '../assets/weight-scale.png'
import pulseOximeter from '../assets/pulse-oximeter.png'
import { Field, Modal, btnGhost, btnPrimary, inputCls, useToast } from '../components/feedback'

const statMeta: { label: string; icon: LucideIcon; badge: string; tag?: { text: string; cls: string }; blob: string; count: (d: Device[]) => number }[] = [
  { label: 'Total Devices', icon: MonitorSmartphone, badge: 'bg-brand-50 text-brand-500', blob: 'bg-brand-50', count: (d) => d.length },
  { label: 'Active Devices', icon: CircleCheck, badge: 'bg-green-50 text-green-600', tag: { text: 'Active', cls: 'bg-green-50 text-green-600' }, blob: 'bg-green-50', count: (d) => d.filter((x) => x.status === 'connected').length },
  { label: 'Standby Devices', icon: CirclePause, badge: 'bg-orange-50 text-orange-500', tag: { text: 'Standby', cls: 'bg-orange-50 text-orange-500' }, blob: 'bg-orange-50', count: (d) => d.filter((x) => x.status === 'standby').length },
  { label: 'Disconnected', icon: CircleAlert, badge: 'bg-red-50 text-red-600', tag: { text: 'Disconnected', cls: 'bg-red-50 text-red-600' }, blob: 'bg-red-50', count: (d) => d.filter((x) => x.status === 'disconnected').length },
]

type Status = 'connected' | 'standby' | 'disconnected'
const statusStyle: Record<Status, { label: string; cls: string; dot: string }> = {
  connected: { label: 'Connected', cls: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
  standby: { label: 'Standby', cls: 'bg-orange-50 text-orange-500', dot: 'bg-orange-400' },
  disconnected: { label: 'Disconnected', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
}

interface Device {
  name: string
  sync: string
  img: string
  tags: string[]
  status: Status
}

const initialDevices: Device[] = [
  { name: 'Apple Watch Ultra 2', sync: '2 mins ago', img: appleWatch, tags: ['Heart Rate', 'Sleep', 'Activity'], status: 'connected' },
  { name: 'Withings BP Monitor', sync: '1 hour ago', img: bpMonitor, tags: ['Blood Pressure'], status: 'connected' },
  { name: 'Smart Weight Scale', sync: '6 hours ago', img: weightScale, tags: ['Weight', 'BMI', 'Body Fat'], status: 'standby' },
  { name: 'Pulse Oximeter', sync: '1 day ago', img: pulseOximeter, tags: ['SpO2', 'Pulse Rate'], status: 'disconnected' },
]

const activity = [
  { t: 'Apple Watch Sync Complete', d: 'Detailed sleep analysis and heart rate variability metrics imported successfully.', time: '14:22 PM', icon: RefreshCw, badge: 'bg-green-50 text-green-600', reading: { v: '68 BPM (RESTING)', cls: 'text-brand-500' } },
  { t: 'Blood Pressure Check', d: 'Automated measurement logged from Withings BPM Connect.', time: '11:05 AM', icon: HeartPulse, badge: 'bg-brand-50 text-brand-500', reading: { v: '118/78 MMHG', cls: 'text-green-600' } },
  { t: 'Low Battery Warning', d: 'Pulse Oximeter battery is below 15%. Recharging is recommended to prevent data loss.', time: 'Yesterday', icon: BatteryLow, badge: 'bg-orange-50 text-orange-500' },
]

// Daily sync success, as a percent of chart height
const bars = [
  { d: 'M', v: 95 }, { d: 'T', v: 95 }, { d: 'W', v: 85 }, { d: 'T', v: 92 },
  { d: 'F', v: 100 }, { d: 'S', v: 40 }, { d: 'S', v: 65 },
]

const deviceTypes: { name: string; img: string; tags: string[] }[] = [
  { name: 'Smartwatch', img: appleWatch, tags: ['Heart Rate', 'Sleep', 'Activity'] },
  { name: 'Blood Pressure Monitor', img: bpMonitor, tags: ['Blood Pressure'] },
  { name: 'Weight Scale', img: weightScale, tags: ['Weight', 'BMI'] },
  { name: 'Pulse Oximeter', img: pulseOximeter, tags: ['SpO2', 'Pulse Rate'] },
]

export default function Devices() {
  const toast = useToast()
  const [devices, setDevices] = useState(initialDevices)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [reconnecting, setReconnecting] = useState<string | null>(null)
  const [detail, setDetail] = useState<Device | null>(null)
  const [adding, setAdding] = useState(false)
  const [history, setHistory] = useState(false)
  const [type, setType] = useState(0)
  const [label, setLabel] = useState('')
  const [addError, setAddError] = useState('')

  const patch = (name: string, change: Partial<Device>) =>
    setDevices((d) => d.map((x) => (x.name === name ? { ...x, ...change } : x)))

  const syncNow = (name: string) => {
    setSyncing(name)
    window.setTimeout(() => {
      patch(name, { sync: 'Just now', status: 'connected' })
      setSyncing(null)
      toast(`${name} synced.`)
    }, 1200)
  }

  const reconnect = (name: string) => {
    setReconnecting(name)
    window.setTimeout(() => {
      patch(name, { status: 'connected', sync: 'Just now' })
      setReconnecting(null)
      toast(`${name} reconnected.`)
    }, 1400)
  }

  const openAdd = () => {
    setType(0)
    setLabel('')
    setAddError('')
    setAdding(true)
  }

  const addDevice = () => {
    const name = label.trim() || deviceTypes[type].name
    if (devices.some((d) => d.name.toLowerCase() === name.toLowerCase())) return setAddError('A device with this name already exists.')
    setDevices((d) => [...d, { name, sync: 'Just now', img: deviceTypes[type].img, tags: deviceTypes[type].tags, status: 'connected' }])
    setAdding(false)
    toast(`${name} added.`)
  }

  return (
    <div className="pt-2">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-[32px] font-bold tracking-tight">
            Connected Devices <Radio className="h-6 w-6 text-brand-500" />
          </h1>
          <p className="mt-1 text-[15px] text-gray-500">
            Manage and monitor your synchronized medical devices for comprehensive real-time health data tracking.
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 text-[15px] font-medium text-white shadow-btn">
          <Plus className="h-5 w-5" /> Add New Device
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {statMeta.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <span className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-70 ${s.blob}`} />
            <div className="relative flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.badge}`}>
                <s.icon className="h-6 w-6" />
              </div>
              {s.tag && <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${s.tag.cls}`}>{s.tag.text}</span>}
            </div>
            <p className="relative mt-5 text-[15px] font-semibold text-gray-700">{s.label}</p>
            <p className="relative mt-1 text-[15px] text-gray-700">{String(s.count(devices)).padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* Device cards */}
      <div className="mt-8 grid grid-cols-4 gap-6">
        {devices.map((dev) => {
          const st = statusStyle[dev.status]
          const offline = dev.status === 'disconnected'
          return (
            <div key={dev.name} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${st.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} /> {st.label}
              </span>
              <div className="mt-8 h-[140px] overflow-hidden rounded-2xl bg-gray-100">
                <img src={dev.img} alt={dev.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-6 text-[15px] text-gray-800">{dev.name}</p>
              <p className="mt-1 text-sm text-gray-400">Last sync: {dev.sync}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {dev.tags.map((t) => (
                  <span key={t} className="rounded-md bg-gray-100 px-2 py-1 text-[9px] font-bold uppercase text-gray-500">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {offline ? (
                  <button disabled className="cursor-not-allowed rounded-xl bg-gray-200 py-3 text-sm text-gray-500">Offline</button>
                ) : (
                  <button
                    onClick={() => syncNow(dev.name)}
                    disabled={syncing === dev.name}
                    className="rounded-xl bg-brand-gradient py-3 text-sm text-white shadow-brand disabled:opacity-70"
                  >
                    {syncing === dev.name ? 'Syncing...' : 'Sync Now'}
                  </button>
                )}
                <button
                  onClick={() => (offline ? reconnect(dev.name) : setDetail(dev))}
                  disabled={reconnecting === dev.name}
                  className="rounded-xl border border-gray-200 py-3 text-sm text-gray-600 disabled:opacity-70"
                >
                  {reconnecting === dev.name ? 'Connecting...' : offline ? 'Reconnect' : 'Details'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity + overview */}
      <div className="mt-8 grid grid-cols-[1fr_1fr_1fr_1fr] gap-6">
        <div className="col-span-3 rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-[15px] text-gray-800">Recent Device Activity</h3>
            <button onClick={() => setHistory(true)} className="text-[15px] text-brand-500">View History</button>
          </div>
          <div className="relative">
            <span className="absolute bottom-10 left-4 top-4 w-px bg-gray-100" />
            {activity.map((a, idx) => (
              <div key={a.t} className={`relative flex gap-5 ${idx < activity.length - 1 ? 'mb-6 border-b border-gray-100 pb-6' : ''}`}>
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.badge}`}>
                  <a.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="text-[15px] text-gray-800">{a.t}</p>
                    <span className="text-[11px] text-gray-400">{a.time}</span>
                  </div>
                  <p className="mt-1 text-[15px] text-gray-600">{a.d}</p>
                  {a.reading && (
                    <span className="mt-3 inline-block rounded-md bg-gray-100 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-700">
                      Latest Reading: <span className={a.reading.cls}>{a.reading.v}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
          <h3 className="text-[15px] text-gray-800">Connectivity Overview</h3>
          <div className="mt-6 flex justify-center">
            <div className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border-[7px] border-brand-500">
              <span className="text-[28px] font-bold leading-none">98%</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-wide">Sync Success</span>
            </div>
          </div>
          <p className="mt-5 text-center text-[15px] text-gray-600">Last 7 days connectivity performance</p>
          <div className="mt-10 flex h-[100px] items-end justify-between gap-1.5 px-2">
            {bars.map((b, i) => (
              <div key={i} className="flex h-full flex-1 flex-col justify-end rounded-t-md bg-brand-100/70">
                <div
                  className={`rounded-t-md ${b.v < 50 ? 'bg-brand-400/60' : 'bg-brand-500'}`}
                  style={{ height: `${b.v}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between px-2 text-[9px] font-bold text-gray-500">
            {bars.map((b, i) => (
              <span key={i} className="flex-1 text-center">{b.d}</span>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between text-[9px] font-bold uppercase">
            <span className="text-gray-600">Avg Sync Freq: 14.5x/Day</span>
            <span className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" /> 12%
            </span>
          </div>
        </div>
      </div>

      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)} footer={<button className={btnGhost} onClick={() => setDetail(null)}>Close</button>}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="font-semibold">{statusStyle[detail.status].label}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Last sync</dt><dd className="font-semibold">{detail.sync}</dd></div>
            <div className="flex justify-between gap-6"><dt className="text-gray-500">Metrics</dt><dd className="text-right font-semibold">{detail.tags.join(', ')}</dd></div>
          </dl>
        </Modal>
      )}

      {history && (
        <Modal title="Device history" onClose={() => setHistory(false)} width="max-w-lg" footer={<button className={btnGhost} onClick={() => setHistory(false)}>Close</button>}>
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.t} className="rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex justify-between gap-4">
                  <p className="text-sm font-semibold">{a.t}</p>
                  <span className="text-xs text-gray-400">{a.time}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{a.d}</p>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {adding && (
        <Modal
          title="Add new device"
          onClose={() => setAdding(false)}
          footer={
            <>
              <button className={btnGhost} onClick={() => setAdding(false)}>Cancel</button>
              <button className={btnPrimary} onClick={addDevice}>Add device</button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Device type">
              <select value={type} onChange={(e) => setType(Number(e.target.value))} className={inputCls}>
                {deviceTypes.map((t, i) => (
                  <option key={t.name} value={i}>{t.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Device name (optional)" error={addError}>
              <input value={label} onChange={(e) => { setLabel(e.target.value); setAddError('') }} placeholder={deviceTypes[type].name} maxLength={40} className={inputCls} />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  )
}
