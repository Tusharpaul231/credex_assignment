# METRICS.md - Metrics & Measurement

## What I would pay attention to first

The most important metric is probably: - how many people actually complete the audit

Traffic alone doesn't really matter if people bounce immediately or never
finish the form.

Since this is more of a utility tool than a daily-use product, I don't think
metrics like DAU or retention are very meaningful early on.

---

## Metrics that actually matter

### 1. Audit completion rate

This tells me whether the landing page and form are understandable.

If lots of people visit but very few complete the audit, that probably means:
- the form feels too long
- the value proposition isn't clear
- or users don't trust the tool yet

This is probably the first metric I'd try to improve.

---

### 2. Email capture rate

After users see their results, do they actually want the report emailed to
them or want follow-up information?

That feels like a better signal of genuine interest than just page views.

I'd especially watch whether teams with larger estimated savings are more
likely to leave contact details.

---

### 3. Share rate

One interesting signal would be whether people share their audit results.

Since the product generates a public shareable link, sharing could become a
major acquisition channel if users find the results genuinely useful or
surprising.

If nobody shares audits, that probably means the output isn't compelling yet.

---

## Product signals I'd watch qualitatively

Beyond numbers, I think the most useful feedback early on would come from:
- what kinds of tools people enter most often
- whether users disagree with recommendations
- whether teams actually feel they have overlap
- whether people think the savings estimates are realistic

Several interview responses already suggested that teams knowingly keep
multiple AI tools because different products are better for different tasks.

That means the product has to be careful not to oversimplify the problem as:
"just cancel subscriptions."

---

## What I'd instrument first

For a first version, simple event tracking is enough.

Main events:
- landing page visits
- audit started
- audit completed
- email submitted
- share button clicked

I would probably store these in a lightweight events table in Supabase rather
than adding a heavy analytics stack immediately.

---

## What would worry me

A few things would probably indicate the product positioning is wrong:

- lots of visitors but very low audit completion
- audits completing but nobody sharing results
- users consistently ignoring recommendations
- very few high-spend teams using the product

That would suggest either:
- the messaging is off
- the recommendations aren't trusted
- or teams don't actually view AI overlap as a painful enough problem yet

---

## What success would look like

Early success would probably look less like "massive traffic" and more like:
- strong engagement from small engineering teams
- people sharing results organically
- founders replying with "this actually reflected our stack accurately"
- repeat usage whenever teams revisit tooling decisions

If the product consistently starts conversations around AI spend visibility,
that's probably a good sign the idea has real demand.