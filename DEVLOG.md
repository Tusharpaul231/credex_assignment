# Dev Log

## Day 1 - 2026-05-07
**Hours worked:** 4.5

**What I did:** Set up Next.js project with TypeScript and Tailwind. Initialized Supabase project. Created repo structure, deployed empty shell to Vercel. Drafted ARCHITECTURE.md with system diagram. Sent DMs to some my networks abt the project.

**What I learned:** Supabase’s free tier is more generous than expected for this use case. And Supabase is better than Firebase. And first I went with the Anthropic API key but found out it's not free so I went with OpenAI API key.

**Blockers / what I'm stuck on:** Claude Max pricing is slightly confusing because Anthropic separates consumer plans from API pricing. Need to verify exact limits/features before finalizing PRICING_DATA.md to avoid incorrect recommendations inside the audit engine.

**Plan for tomorrow:** Finalize pricing research from official vendor pages and start implementing the first version of the audit rule engine. Build the CI pipeline.


## Day 2 - 2026-05-08
**Hours worked:** 5

**What I did:** Built the initial frontend interaction layer for the application. Implemented the main `SpendForm` component with support for multiple AI tools and dynamic rows. Created a reusable `ToolRow` component for handling individual tool inputs. Added `pricingData.ts`. Scaffolded the initial `/api/audit` route with a temporary mock response to validate frontend/backend flow. Also integrated the form into the landing page and cleaned up the root layout structure.

**What I learned:** Building the form first before implementing the audit engine made the data model much clearer. Separating each tool row into its own component simplified state management and made future validation logic easier to reason about. Also realized that centralizing pricing data early will make recommendation logic and testing much easier later.

**Blockers / what I'm stuck on:** The UI is still mostly unstyled and focused on functionality first. Need to decide how much pricing should be auto-calculated versus manually editable by users.

**Plan for tomorrow:** Improve the form UX with proper styling using Tailwind + shadcn/ui, and start implementing the deterministic audit engine logic for generating savings recommendations the main part.


## Day 3 - 2026-05-09
**Hours worked:** 6.5

**What I did:** Started implementing the core audit engine logic in `auditEngine.ts`. Set up the testing structure using Vitest and created the initial `tests/` directory for validating audit calculations and recommendation outputs. Also updated the Vitest configuration to support the current project structure and prepared the repository for automated test execution through GitHub Actions CI.

**What I learned:** Separating pricing data from recommendation logic made the audit engine significantly easier to reason about. Writing tests early helped identify edge cases in savings calculations before integrating the logic into the UI.

**Blockers / what I'm stuck on:** Still refining how aggressive the recommendation engine should be. Some optimization suggestions can feel too opinionated if the logic is too strict. Need to balance realistic savings opportunities with recommendations that users would actually trust.

**Plan for tomorrow:** Integrate the audit engine with the frontend form submission flow, build the initial audit results UI, and start connecting the generated audit data to Supabase persistence.


## Day 4  2026-05-10

**Hours worked:** 6

**What I did:**
Built the entire results pipeline end to end. Set up Supabase with the audits
and leads tables by running the schema SQL in the dashboard. Created two
Supabase clients a browser client using the anon key and a server client
using the service role key for API routes. Built the POST /api/audit route
which runs the audit engine, calls an AI API for the personalised summary,
saves the full audit to Supabase, and returns a nanoid. Built the shareable
/audit/[id] results page with full styling  hero savings block, per-tool
breakdown cards, Credex CTA for high-savings audits, AI summary section, lead
capture form, and share button. Also built all the sub-components: HeroSavings,
ToolAuditCard, CredexCTA, AISummary, ShareButton, and LeadCapture. Fixed a
hydration error on the form by wrapping SpendForm in a client-only
SpendFormWrapper using dynamic import with ssr: false. Wrote PROMPTS.md
documenting the AI prompt, model choice, and fallback logic.

**What I learned:**
ssr: false in next/dynamic is not allowed inside Server Components it must
live in a Client Component. Solved by creating a thin SpendFormWrapper with
"use client" that handles the dynamic import. Also learned that Gemini 2.0
Flash free tier has limit: 0 in India regardless of account  a regional
restriction. Switched to Groq (llama-3.1-8b-instant) which is fully free,
works from India, and produces comparable summary quality. The fallback
summary worked correctly throughout testing before the AI was wired up,
which validated that the graceful degradation logic was solid.

**Blockers / what I'm stuck on:**
Three API issues back to back  OpenAI had no free credits, Gemini 2.0 Flash
returned limit: 0 regionally even on a fresh account, gemini-1.5-flash-latest
had the same issue. Resolved by switching to Groq. Each failure was handled
gracefully by the fallback so the audit flow kept working throughout. Supabase
insert was failing because the schema SQL had not been run yet 
fixed by running it in the SQL editor.

**Plan for tomorrow:**
Day 5  build the /api/lead route, wire up Resend for transactional
confirmation emails, verify the full lead capture flow saves to the leads
table with the correct audit_id foreign key, and write the Day 5 DEVLOG entry.


## Day 5 — 2026-05-11

**Hours worked:** 5

**What I did:**  
Built the `/api/lead` route with email validation, duplicate lead checks, Supabase persistence, and Resend transactional emails. Added personalized email copy based on savings detected and conditional Credex consultation messaging for high-savings users. Also completed a major UI polish pass across the landing page and audit results pages using Tailwind + shadcn/ui components.

**What I learned:**  
Discovered that `globals.css` was never imported in `layout.tsx`, which caused the entire app to render without styling. Also learned that Tailwind v4 plugin handling differs from v3 removing the invalid `@plugin "tailwindcss-animate"` line fixed the broken CSS pipeline after the shadcn reinitialization.

**Blockers / what I'm stuck on:**  
Spent a significant amount of time debugging Tailwind CSS issues caused by the missing global stylesheet import and incompatible Tailwind v4 animation plugin configuration.

**Plan for tomorrow:**  
Complete all remaining documentation files, run Lighthouse audits on the deployed app, improve accessibility/performance scores, and do a final UI cleanup pass.