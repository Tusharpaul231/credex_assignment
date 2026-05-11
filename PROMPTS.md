# Prompts

## Audit Summary Prompt

Used in: `src/app/api/audit/route.ts` → `generateAISummary()`

### Final prompt (in production)

```
You are a concise financial advisor specialising in AI tool spend for startups.

Given this AI tool audit:
- Team size: {teamSize}
- Primary use case: {useCase}
- Tools audited: {toolsSummary}
- Total monthly savings identified: ${totalMonthlySavings}
- Top recommendations: {topRecommendations}

Write a 90-110 word personalised summary paragraph for this specific team.
Tone: direct, helpful, not salesy.
Lead with the biggest savings opportunity or confirm they are spending well.
End with one concrete next step they can take today.
Do not use bullet points. Do not mention Credex. Use specific tool names and dollar amounts.
```

### Model used
`llama-3.1-8b-instant` via **Groq** — chosen after evaluating three providers
(see provider journey below). Groq's free tier provides 14,400 requests/day
with no billing required, and llama-3.1-8b-instant produces output comparable
to GPT-4o-mini for short summary paragraphs.

---

## Provider journey (what I tried and why I switched)

### Attempt 1 — OpenAI (gpt-4o-mini)
- **Why I tried it:** Most familiar API, good quality for short summaries.
- **What happened:** Free tier has zero credits. Got `insufficient_quota` 429
  on first call. Would require adding billing ($5 minimum).
- **Why I switched:** Wanted a genuinely free option for development. The
  assignment requires AI — paying for it shouldn't be a barrier.

### Attempt 2 — Google Gemini (gemini-2.0-flash)
- **Why I tried it:** Advertised as free tier with 1,500 requests/day.
- **What happened:** Got `limit: 0` on every request — even after creating a
  fresh API key on a brand new Google account. Error:
  `Quota exceeded for metric: generate_content_free_tier_requests, limit: 0`
- **Root cause:** Gemini 2.0 Flash free tier is regionally restricted and is
  not available in India. The limit is set to 0 at the infrastructure level
  regardless of account age or billing status.
- **Also tried:** `gemini-1.5-flash-latest` — same regional restriction, same
  `limit: 0` result.
- **Why I switched:** Regional restriction with no workaround on the free tier.

### Attempt 3 — Groq (llama-3.1-8b-instant) ✓ CURRENT
- **Why I tried it:** Genuinely free tier, no credit card required, works
  globally including India.
- **What happened:** Works immediately. First call succeeded, output quality
  is good for 90-110 word summaries.
- **Free tier limits:** 14,400 requests/day, 30 requests/minute — sufficient
  for this use case.
- **Why I kept it:** Free, fast (~300ms), reliable, no regional restrictions.

---

## What I tried that didn't work (prompt iteration)

1. **"Roast their spend" framing:** First draft told the model to "call out
   wasteful spending directly." Outputs were too harsh and condescending.
   Switched to "financial advisor" persona which produced helpful, direct
   tone without being aggressive.

2. **Generic prompt without injected data:** Early version just said "summarise
   this AI audit." Model produced near-identical boilerplate regardless of
   which tools were audited. Fixed by injecting the full toolsSummary string
   with actual tool names, plan names, and dollar amounts.

3. **Telling the model to mention Credex:** Every output read like an ad.
   Credex CTA is surfaced separately in the UI — the AI summary should feel
   like independent advice. Removed all Credex references from the prompt.

4. **max_tokens too high:** max_tokens: 1000 produced rambling 300-word
   outputs. Capped at 200 to enforce the 90-110 word target.

5. **No format instruction:** Without "do not use bullet points," the model
   defaulted to a bulleted list. Added explicit prose instruction.

---

## Fallback template (used when Groq API fails or times out)

```
If isAlreadyOptimal:
"Your team of {teamSize} is spending well on AI tools. Based on your
{useCase} workflow, your current stack is right-sized — no obvious overspend
detected. That said, AI tool pricing changes frequently. Consider re-auditing
every quarter, and if your API usage grows past $500/mo, bulk credits can
offer meaningful savings."

Otherwise:
"Your team of {teamSize} could save ${totalMonthlySavings}/month by
optimising your AI tool stack. The biggest opportunity is {topTool} —
{recommendedAction}. Over 12 months, these changes add up to
${totalAnnualSavings} in recovered budget. Start with the highest-savings
change first and re-audit in 30 days to track progress."
```

### Why the fallback matters
Ensures the user always gets a complete, useful audit page even when the AI
is unavailable. All three API failures during development were handled
gracefully by this fallback, which validated the error handling design.