# FinPay

FinPay is a modern payments dashboard for viewing transactions, managing merchants, and tracking refunds.

## Tech stack used so far
- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS with shadcn-style UI components
- Supabase SSR for authenticated data access
- Drizzle ORM with PostgreSQL schema definitions
- Recharts for dashboard analytics
- Vitest and React Testing Library for unit tests

## Features built so far
- Shared app shell with sidebar and header navigation
- Dashboard summary cards and payment volume chart
- Transaction list and transaction detail pages
- Transaction creation flow with current Supabase user capture
- Transaction status updates with success, pending, and failed options
- Refund modal with amount and reason inputs
- Refund history table per transaction
- Refund validation to prevent over-refunding
- Merchant list, merchant creation, and merchant detail views
- Seed data for merchants, transactions, and refunds

## AI prompts used so far
- Create dummy transaction and merchant seed rows
- Fix a seed-file syntax and function-call issue
- Replace static transaction data with real Supabase-backed data
- Create transaction and merchant detail pages with navigation
- Add a reusable shared app shell layout
- Add dashboard metrics using real computed values
- Add add-transaction and add-merchant modals
- Add refund flows with validation and history
- Add transaction status update support

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Verification

```bash
npm run build
npm run lint
npm test
```


