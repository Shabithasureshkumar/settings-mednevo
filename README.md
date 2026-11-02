# Mednevo – Settings (React + TypeScript + Tailwind)

```bash
npm install
npm run dev
```

Screens (switch from the sidebar): Account, Notifications, Privacy, Devices, Language, Insurance, Data, Period Tracker, Help.

`src/assets/*.png` are cropped from the design mockup as placeholders — replace them with your original HD photos (same file names).

## Audit Logs

Sidebar → **Audit Logs** (below Privacy). Search, date range, user/action/module filters, CSV export, and a details drawer on row click.

Real data: copy `.env.example` to `.env` and set `VITE_AUDIT_LOGS_API`. The record shape is the `AuditLog` type in `src/services/auditLogs.ts`. Without it (or if the request fails), sample records are shown with a "Sample data" badge.
