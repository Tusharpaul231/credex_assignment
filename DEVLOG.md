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