# FinPay Development Notes

## Project overview
FinPay is a Next.js application for managing transactions, merchants, refunds, and dashboard insights.

## Architecture highlights
- App Router pages live under the app folder.
- Shared layout pieces are kept in components/shared.
- Server-side data operations for transactions and merchants live in server/.
- Database schema and seed data live under db/.

## Working conventions
- Prefer server actions for data reads and writes that use Supabase.
- Keep UI components small and composable.
- Reuse the shared app shell for dashboard, transactions, and merchants pages.
- Validate business rules on the server before writing to the database.

## Useful commands
- npm run dev
- npm run build
- npm run lint
- npm test
