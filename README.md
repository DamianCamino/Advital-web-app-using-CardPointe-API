# Vital Pay — CardPointe Payment Integration

Web-based checkout for Vital Pay, integrating CardPointe (Fiserv) as the
payment processor and GoHighLevel (GHL) as the CRM/workflow platform for
Ad Vital clinics. Supports both card and ACH/bank transfer payments.

## What this is

A single Node/Express backend that:
- Exposes the CardPointe payment API (`/payments`, `/checkout`) — auth,
  capture, void, refund, inquire.
- Serves a compiled React checkout UI as static files
  (`backend/public/checkout`) — no separate frontend deployment needed.
- Handles GHL OAuth install, SSO, and custom payment provider webhooks
  (`/ghl`, `/oauth`, `/webhooks`).
- Handles Alphaeon financing sessions (`/alphaeon`).

## Project structure

```text
VitalPay2.0/
├── backend/                 # Express API + compiled checkout (deploy this)
│   ├── src/
│   │   ├── config/          # CardPointe / Alphaeon env config
│   │   ├── lib/              # Payment gateway abstraction (CardPointe, NMI)
│   │   ├── middleware/       # Auth, webhook signature verification, rate limits
│   │   ├── routes/           # payments, checkout, query, webhooks, ghl, alphaeon
│   │   ├── services/         # GHL client/SSO/session, merchant config, tx store
│   │   └── utils/            # crypto, logging, retry, idempotency
│   └── public/checkout/      # Compiled checkout UI (served statically)
├── frontend-checkout/        # React/Vite/Tailwind source for the checkout UI
├── postman/                  # CardPointe UAT + local Postman collections
└── scripts/                  # PowerShell helpers (ngrok, local dev)
```

## Requirements

- Node.js 18+
- CardPointe UAT (sandbox) or production credentials from Fiserv
- (Optional) GHL OAuth app credentials, if using the GHL integration

## Environment variables

This copy doesn't include a `.env.example`. The backend needs a `.env`
file (referenced as `infrastructure/.env` relative to `backend/src/`,
i.e. `VitalPay2.0/infrastructure/.env`) with at least:

```env
# CardPointe
CARDPOINTE_ENV=uat
CARDPOINTE_SITE_UAT=fts-uat
CARDPOINTE_MERCHID_UAT=<merchant id>
CARDPOINTE_API_USER_UAT=<api user>
CARDPOINTE_API_PASS_UAT=<api pass>

# Server
PORT=3000
NODE_ENV=development
PUBLIC_BASE_URL=http://localhost:3000
DEFAULT_PAYMENT_GATEWAY=cardpointe

# GHL (optional, only needed for GHL install/SSO/webhooks)
GHL_CLIENT_ID=
GHL_CLIENT_SECRET=
GHL_REDIRECT_URI=http://localhost:3000/oauth/installed

# Alphaeon (optional)
ALPHAEON_ENV=sandbox
```

Generate any required security keys with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running locally

```bash
cd backend
npm install
npm run dev
```
