# REFLECTION.md

## Why I built this

I noticed that AI subscriptions are quietly becoming a serious recurring expense for developers and startups. Most engineers now use multiple tools like ChatGPT, Claude, Cursor, Copilot, Gemini, etc., and teams often adopt them organically without any centralized visibility.

The original idea was simple: build a tool that helps people understand whether they are overspending on AI tools. But after speaking with real users, I realized the bigger problem was not just pricing, it was visibility. Teams usually do not know which subscriptions are heavily used, which overlap too much.

That insight shaped AIAudit into more of an AI stack visibility tool rather than just a savings calculator.

---

## What surprised me during user interviews

One thing that surprised me was how intentionally people keep overlapping tools.

I initially assumed users would want to reduce down to a single AI subscription, but most engineers explained that different tools are better for different workflows. Claude was repeatedly described as stronger for architecture and complex coding logic, while ChatGPT was preferred for research, multimodal tasks, and general brainstorming.

Another major insight was the idea of “Shadow AI.” Multiple interviewees mentioned that engineers frequently buy subscriptions independently because they want flexibility or faster access to features. This means companies often have no clear view of their actual AI spending.

The interviews changed how I thought about the product. Instead of aggressively pushing “cut costs,” the messaging became more focused on visibility, utilization, overlap, and consolidation opportunities.

---

## What I would improve with more time

If I had more time, I would focus on improving both the product intelligence and the infrastructure side of the project.

The biggest product improvement would be real usage integrations. Right now users manually enter their subscriptions and pricing. The next step would be integrating directly with billing systems, workspace dashboards, or APIs to automatically detect subscriptions, utilization patterns, inactive seats, and duplicate spending.

I would also improve the recommendation engine. Currently the audit logic is rule-based, but I would like to make recommendations smarter based on company size, team roles, engineering workflows, and actual usage behavior.

From a DevOps and infrastructure perspective, I would invest more into production readiness. I would containerize the application properly with Docker, create CI/CD pipelines using GitHub Actions, and automate testing + deployments instead of relying only on manual deployment workflows. I would also add monitoring and observability using tools like Prometheus, Grafana, or OpenTelemetry to track API latency, failures, and user activity patterns.

Another area I would improve is scalability and reliability. Right now the project works well as an MVP, but with higher traffic I would introduce caching layers, rate limiting, centralized logging, and better environment management across staging and production deployments.

I would also spend more time refining mobile responsiveness, accessibility, and onboarding UX.

---

## What I learned overall

This project taught me that building a product is very different from just building software.

The technical implementation was only one part of the process. Talking to users, understanding how people actually behave, refining messaging, and thinking about distribution ended up being just as important as writing code.

I also learned how quickly assumptions break once you start talking to real users. I originally thought the problem was “AI tools are expensive.” The interviews showed that the real problem is “teams don’t have visibility into AI spending and usage.”

On the engineering side, I became much more comfortable working with Next.js App Router, API routes, Tailwind v4, Supabase integration, dark mode handling, deployment/debugging workflows on Vercel, and thinking more carefully about production-level architecture decisions.

Overall, this project pushed me to think more like a product engineer and DevOps-focused builder instead of only focusing on feature implementation.