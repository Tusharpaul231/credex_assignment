# Architecture

## System Diagram

```mermaid
graph TD
    A[User lands on page] --> B[Spend Input Form]
    B --> C{Form submitted}
    C --> D[Audit Engine\nPure TypeScript logic]
    D --> E[Audit Results Page]
    E --> F[Anthropic API\nPersonalized summary]
    F --> G{API success?}
    G -->|Yes| H[AI summary displayed]
    G -->|No| I[Fallback template shown]
    E --> J[Save audit to Supabase\nwith unique ID]
    J --> K[Shareable URL /audit/:id]
    E --> L{Savings > $100?}
    L -->|Yes| M[Email capture modal]
    M --> N[Store lead in Supabase]
    N --> O[Transactional email\nvia Resend]
    L -->|No| P[Soft email capture\n'Notify me' CTA]
```

## Data Flow

1. User fills spend form → stored in localStorage (persists on reload)
2. On submit → POST /api/audit with FormInput JSON
3. API route runs auditEngine.ts (no AI, pure rules)
4. Simultaneously calls Anthropic API for summary paragraph
5. Saves full audit object to Supabase `audits` table with nanoid
6. Returns audit ID → client redirects to /audit/[id]
7. Results page fetches audit by ID from Supabase
8. User optionally submits email → POST /api/lead → stored in `leads` table

## Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Supabase**
- **Tailwind + shadcn/ui**
- **Resend**
- **Vercel**
