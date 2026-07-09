# FinPay

FinPay is a modern payments dashboard for viewing transactions, managing merchants, and tracking refunds.

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

## Tech stack of the application

```
- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS with shadcn-style UI components
- Supabase for postgreSQL 
- Supabase SSR for authenticated data access
- Drizzle ORM with PostgreSQL schema definitions
- Recharts for dashboard analytics
- Vitest and React Testing Library for unit tests
```

## Complete Architecture

### 1. Login
```
- if user not logged in, direct to login page
- if user logged in, direct to dashboard
```

### 2. Logout
```
- click on the user profile avatar
- it will open a drop down for logout
```

### 3. Dashboard 
```
- it will show card of "Amount spent this week"
- it will show card of "Active Merchants" we have in our db
- it will show a graph of payments that occured this week
```

### 4. Transactions
```
- it will show card of "Total transactions Amount" at the top
- it will show button to add a transaction
    - you can only add a transaction with a particular merchant
    - if merchant don't exist, it will give error
- it will show all transactions in dec order of date created
- when click on any particular transaction, it will open the complete trasaction details
    - the opened card will have all the details of a particular transaction
    - it will have refund button
    - refund will only occur if transaction status is success
        - refund button will be disabled if "transaction.status is not success"
        - if it's pending, refund will not occur, refund button become disable
    - it will have all the refund history as well
```

### 5. Merchants
```
- it will show all the merchants in a table format
    - when you click on any merchant, it will open a detailed view + it will show all the transactions done by this particular merchant
- it will show button to add new merchant
    - "Add merchant" will open a modal 
    - it accepts (name, email, phone, address) 
```

## All Features
```
- sidebar and header navigation
- Dashboard summary cards and payment volume chart
- Transaction list and transaction detail pages
- Transaction creation flow with current Supabase user
- Transaction status updates with success, pending, and failed options
- Refund modal with amount and reason inputs
- Refund history table per transaction
- Refund validation to prevent over-refunding
- Merchant list, merchant creation, and merchant detail views
- Seed data for merchants, transactions, and refunds
```

## AI prompts used

```
code a transaction page.tsx as well, it will show total amount card and add transaction button at the top then table of all transactions
```
```
Create dummy transaction and merchant seed rows for db entries
```

```
- Add a reusable shared app shell layout
- Fix a seed-file syntax and function-call issue
- Replace static transaction data with real Supabase-backed data
```

```
@file:page.tsx
@file:transactions.actions.ts
Please code following

1. add the async funtions to fetch all transactions in transactions.actions.ts file
2. update the code in app/transactions/page.tsx to show this data into the transactions table and update the total amount by calculate the total from all these transactions
3. remove all dummy code from app/transactions/page.tsx
4. check db/schema file as well
```

```
please code following

1. app/transactions/page.tsx when click on a single transactions it will route to transaction/trx_id and show a card that contains all the details about this transactions and at the end of the card it will show "refund" button
2. I have provided the transaction/[txn_id]/page.tsx
3. keep the nav bar and side bar, the card will appear in the main element tag
4. shift the logic of nav bar and side bar into separate components, so that we have resuable code
5. update the dashboard/page.tsx to reflect the above changes as well

```

```
code the following
1. app/merchants/page.tsx will have a table that will show all the merchants that we're getting from supabase,
that table react component will show all the columns of table merchants, and on top it will have a button that will open a modal so that we can add a merchant as well, create server/merchants.actions.ts and add the logic accordingly.
2. When click on any merchant in this table it will open a separate page.tsx [merchant/id/page.tsx], on this page, on top we have a card with merchant details and below all the transactions that done by this merchant
3.  And when we click any of this transaction it will open transaction/id/page.tsx
4. Update the dashboard/page.tsx "spent this week" will show total amount that we spent this week in transactions, for that we have to code the logic in transaction.action.ts to get current week transactions total
5. Update the dashbord/page.tsx #sym:paymentVolumeData will show the current week transactions amounts in the value attributes, so update logic accordingly
6. update the dashboard/page.tsx "Active Merchants" as well, make a separate file merchants.actions.ts that will have two functions, 1: to fetch all the merchants for merchants/page.tsx, 2 : to get the total merchants that we can show in "Active Merchants" card
7. in transaction/page.tsx add a button "add transaction" after "Total transaction amount" card, that will open a model so that we can add a transaction, add supabase logic in transactions.actions.ts

```

-> refund amount logic
```
code the following
1. in transactions.actions.ts, in createTrasaction function user_id should be the current logged in user id provide by supabase
2. in transactions/id/page.tsx, when we click on the refund button it will open a modal that have input as amount, reason. 
create a file server/refunds.actions.ts that will accept this refund and make a db entry w.r.to current transaction_id and status as "successfull" (check db/schema/schema.ts refunds for this)
3. in transactions/id/page.tsx, we will show all the refunds associated with this transaction_id in table format(with columns createDate, amount, status, reason) below the card 
4. we can't make refund greater than the transaction amount, so please write the logic for that as well
(we can have multiple refund for the same transaction id as well)
but the logic make sure that new_refund_amount + other_refunds_amount <= single_transaction_amount

```

```
code the following 
1. Add 5 units tests related to transactions (react testing library)
2. Add skill.md file in the root, and add required details there as well
3. in transaction/id/page.tsx, under badge "transaction.status" add drop down "change status", that can change status and accept only these 3 values "success", "pending" and "failed", add logic in transaction.actions.ts for supabase row update as well
4. in transaction/id/page.tsx, if transaction.status is not equal to "success" , refund button will be disabled
```

```
- Create transaction and merchant detail pages with navigation
- Add dashboard metrics using real computed values
- Add add-transaction and add-merchant modals
- Add refund flows with validation and history
- Add transaction status update support
```


