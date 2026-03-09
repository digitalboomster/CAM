# CAM Flutter (MVP)

Flutter frontend for CAM — **no backend**. All data is mock or stored locally (e.g. Settings in `shared_preferences`).

## Run

From this directory:

```bash
flutter pub get
flutter run
```

From repo root:

```bash
npm run flutter
```

## Screens

- **Dashboard** — Quick actions, NAV / Workspaces / Exports stats, Compliance run check
- **Document Intelligence** — Workspace list and placeholder grid (mock data)
- **Reports** — Report templates, Generate report (navigates to workspace), Export audit table (mock)
- **Settings** — Default export format, Require citations; persisted locally

## Platform

Targets **macOS** and **web** by default. For other platforms, run `flutter run -d <device>`.
