# FinPay Project Notes

## What has been implemented so far
- Built a Next.js 16 app shell with shared navigation for dashboard, transactions, and merchants.
- Added transaction listing and detail pages with Supabase-backed data loading.
- Added transaction creation and refund flows with validation against the transaction amount.
- Added merchant listing, merchant detail, and merchant creation flows.
- Added dashboard summary cards driven by live transaction and merchant counts.
- Added seed data for merchants, transactions, and refunds.

## Current architecture
- Frontend: Next.js App Router, React, TypeScript, Tailwind, shadcn-style UI components.
- Data layer: Supabase SSR client with Drizzle schema definitions.
- Charts: Recharts for dashboard visuals.
- Testing: Vitest + React Testing Library.

## Useful commands
- npm run dev
- npm run build
- npm run lint
- npm test
