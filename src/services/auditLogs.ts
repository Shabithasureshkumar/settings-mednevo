export type AuditStatus = 'success' | 'failed' | 'warning'

export type AuditAction =
  | 'User Created'
  | 'User Updated'
  | 'Settings Changed'
  | 'Password Changed'
  | 'User Login'
  | 'Role Updated'
  | 'Permission Updated'

export interface AuditLog {
  id: string
  user: { name: string; email: string; role: string }
  action: AuditAction
  module: string
  timestamp: string // ISO 8601
  status: AuditStatus
  description: string
  previousValue: string | null
  newValue: string | null
  ipAddress?: string | null
  device?: string | null
}

/**
 * Backend endpoint. Set VITE_AUDIT_LOGS_API in `.env` (e.g. https://api.mednevo.com/v1/audit-logs).
 * Expected response: AuditLog[]  or  { data: AuditLog[] }.
 * When it isn't set (or the request fails), sample records are shown so the UI still works.
 */
const API_URL = import.meta.env.VITE_AUDIT_LOGS_API as string | undefined

export async function fetchAuditLogs(signal?: AbortSignal): Promise<{ logs: AuditLog[]; source: 'api' | 'sample' }> {
  if (API_URL) {
    try {
      const res = await fetch(API_URL, { signal, credentials: 'include', headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: unknown = await res.json()
      const logs = Array.isArray(json) ? json : (json as { data?: AuditLog[] }).data
      if (Array.isArray(logs)) return { logs: logs as AuditLog[], source: 'api' }
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err
      console.warn('[audit-logs] backend unavailable, showing sample data:', err)
    }
  }
  return { logs: sampleAuditLogs, source: 'sample' }
}

const admin = { name: 'David Brock', email: 'david.brock@mednevo.com', role: 'Admin · General Physician' }
const sarah = { name: 'Sarah Johnson', email: 'sara@example.com', role: 'Patient' }
const priya = { name: 'Priya Raman', email: 'priya.raman@mednevo.com', role: 'Care Coordinator' }
const system = { name: 'System', email: 'system@mednevo.com', role: 'Automated' }

export const sampleAuditLogs: AuditLog[] = [
  {
    id: 'AL-10432', user: admin, action: 'User Created', module: 'User Management', timestamp: '2026-10-31T10:42:00+05:30',
    status: 'success', description: 'Created a new user account for Priya Raman.',
    previousValue: null, newValue: 'Priya Raman · Care Coordinator · Active', ipAddress: '103.21.58.142', device: 'Chrome 129 · macOS',
  },
  {
    id: 'AL-10431', user: sarah, action: 'Password Changed', module: 'Login & Security', timestamp: '2026-10-31T09:15:00+05:30',
    status: 'success', description: 'Account password was changed.',
    previousValue: '••••••••', newValue: '••••••••', ipAddress: '49.207.12.88', device: 'Safari · iPhone 15',
  },
  {
    id: 'AL-10430', user: sarah, action: 'Settings Changed', module: 'Notifications', timestamp: '2026-10-30T21:04:00+05:30',
    status: 'success', description: 'Updated Quiet Hours schedule.',
    previousValue: 'Quiet Hours: 11:00 PM – 06:00 AM', newValue: 'Quiet Hours: 10:00 PM – 07:00 AM', ipAddress: '49.207.12.88', device: 'Safari · iPhone 15',
  },
  {
    id: 'AL-10429', user: admin, action: 'Role Updated', module: 'User Management', timestamp: '2026-10-30T16:28:00+05:30',
    status: 'success', description: 'Changed role for Priya Raman.',
    previousValue: 'Role: Front Desk', newValue: 'Role: Care Coordinator', ipAddress: '103.21.58.142', device: 'Chrome 129 · macOS',
  },
  {
    id: 'AL-10428', user: priya, action: 'User Login', module: 'Authentication', timestamp: '2026-10-30T14:02:00+05:30',
    status: 'failed', description: 'Login attempt failed — incorrect password (2 of 5 attempts).',
    previousValue: null, newValue: null, ipAddress: '157.49.201.7', device: 'Edge 128 · Windows 11',
  },
  {
    id: 'AL-10427', user: sarah, action: 'Settings Changed', module: 'Privacy & Consent', timestamp: '2026-10-30T11:37:00+05:30',
    status: 'success', description: 'Toggled "Share Cycle Data with Care Team".',
    previousValue: 'Share Cycle Data with Care Team: On', newValue: 'Share Cycle Data with Care Team: Off', ipAddress: '49.207.12.88', device: 'Mednevo App · Android',
  },
  {
    id: 'AL-10426', user: admin, action: 'Permission Updated', module: 'Roles & Permissions', timestamp: '2026-10-29T18:50:00+05:30',
    status: 'warning', description: 'Granted billing access to the Care Coordinator role.',
    previousValue: 'Billing: No access', newValue: 'Billing: View & Edit', ipAddress: '103.21.58.142', device: 'Chrome 129 · macOS',
  },
  {
    id: 'AL-10425', user: sarah, action: 'User Updated', module: 'Account', timestamp: '2026-10-29T12:11:00+05:30',
    status: 'success', description: 'Updated personal information.',
    previousValue: 'Phone: +1 555-987-0000', newValue: 'Phone: +1 555-123-4567', ipAddress: '49.207.12.88', device: 'Chrome 129 · Windows 11',
  },
  {
    id: 'AL-10424', user: sarah, action: 'User Login', module: 'Authentication', timestamp: '2026-10-29T08:03:00+05:30',
    status: 'success', description: 'Signed in with Apple ID.',
    previousValue: null, newValue: null, ipAddress: '49.207.12.88', device: 'Safari · iPhone 15',
  },
  {
    id: 'AL-10423', user: system, action: 'Settings Changed', module: 'Devices', timestamp: '2026-10-28T23:45:00+05:30',
    status: 'warning', description: 'Pulse Oximeter auto-disconnected after low battery.',
    previousValue: 'Pulse Oximeter: Connected', newValue: 'Pulse Oximeter: Disconnected', ipAddress: null, device: 'Device sync service',
  },
  {
    id: 'AL-10422', user: admin, action: 'User Updated', module: 'User Management', timestamp: '2026-10-28T15:20:00+05:30',
    status: 'success', description: 'Reactivated a deactivated user account.',
    previousValue: 'Status: Deactivated', newValue: 'Status: Active', ipAddress: '103.21.58.142', device: 'Chrome 129 · macOS',
  },
  {
    id: 'AL-10421', user: priya, action: 'Password Changed', module: 'Login & Security', timestamp: '2026-10-27T10:05:00+05:30',
    status: 'success', description: 'Password reset via email link.',
    previousValue: '••••••••', newValue: '••••••••', ipAddress: '157.49.201.7', device: 'Edge 128 · Windows 11',
  },
]
