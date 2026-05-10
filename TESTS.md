# Tests

## How to run

```bash
npm run test          # Run all tests once (used in CI)
npm run test:watch    # Watch mode during development
```

## Setup

Tests use [Vitest](https://vitest.dev/) with Node environment.
Config is in `vitest.config.ts` at the repo root.

Add these scripts to `package.json` if not already present:
```json
"test": "vitest run --config vitest.config.mjs",
"test:watch": "vitest --config vitest.config.mjs"
```

---

## Test file: `tests/auditEngine.test.ts`

All tests cover the core audit engine (`src/lib/auditEngine.ts`).
The audit engine is pure TypeScript with no side effects — no DB, no API calls, no mocking needed.

| # | Test description | What it verifies |
|---|---|---|
| 1 | Cursor Business -> Pro for 2 seats | `savings === 40`, `isOptimal === false`, `recommendedPlan === "Pro"` |
| 2 | Cursor Pro optimal for 5-seat coding team | `isOptimal === true`, `savings === 0` |
| 3 | Copilot Enterprise -> Business for team < 20 | `savings === 100` (5 seats × $20), `recommendedPlan === "Business"` |
| 4 | Copilot Business -> Individual for 3-seat coding team | `savings === 27` (3 × $9), `recommendedPlan === "Individual"` |
| 5 | Claude Max 5x overkill for coding | `savings === 80`, `recommendedPlan === "Pro"` |
| 6 | Claude Max 20x overkill for data | `savings === 180` |
| 7 | Claude Max stays optimal for writing | `isOptimal === true` |
| 8 | ChatGPT Pro -> Plus for general use | `savings === 180`, `recommendedPlan === "Plus"` |
| 9 | Anthropic API $800/mo -> Credex credits | `credexOpportunity === true`, `savings === 200` |
| 10 | Anthropic API $300/mo -> model mix optimisation | `isOptimal === false`, `savings === 120` |
| 11 | OpenAI API $600/mo -> Credex credits | `credexOpportunity === true`, `savings === 150` |
| 12 | Windsurf Team -> Pro for 2-seat team | `savings === 40`, `recommendedPlan === "Pro"` |
| 13 | Multi-tool: savings sum correctly | `totalMonthlySavings === 120`, `totalAnnualSavings === 1440` |
| 14 | Optimal stack returns isAlreadyOptimal | `isAlreadyOptimal === true`, `totalMonthlySavings === 0` |
| 15 | credexRecommended true when savings > $500/mo | `credexRecommended === true` |
| 16 | No false savings on already-optimal multi-tool stack | `totalMonthlySavings === 0`, `isAlreadyOptimal === true` |

**Total: 16 tests across 7 describe blocks.**
All tests pass with `npm run test`. CI runs them on every push to `main`.