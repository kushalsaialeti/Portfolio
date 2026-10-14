# Portfolio structure and optimization guide

This repository is a Vite/React frontend with an Express/Mongoose CMS backend. The current work keeps that stack and makes the editing path simpler without introducing a hosted CMS or paid analytics dependency.

## Current structure

```text
frontend/src/
  app/                         app shell and routes
  cms/                         API client, provider, content normalization
  components/                  shared portfolio UI
  features/public/             public sections, engagement tracking
  features/admin/              protected CMS workspace and editors
  styles/                      global design tokens and Tailwind entry

backend/
  config/                      environment mapping
  data/                        versioned fallback/seed content
  integrations/                Redis, Cloudinary, and mail adapters
  middleware/                  authentication
  modules/auth/                OTP and session lifecycle
  modules/cms/                 sections, baselines, uploads
  modules/contact/             inquiries
  modules/analytics/           privacy-safe events and admin summaries
```

This is a good boundary for the current app. The older `frontend/src/admin`, `frontend/src/sections`, `frontend/src/context`, and backend controller/model/route folders are kept as deleted/renamed history in the working tree; do not recreate them as a second source of truth.

## What was optimized

### CMS

- The dashboard is now organized as **Overview**, **Content**, **Projects**, **Skills**, **Inquiries**, **Analytics**, and **Settings**.
- Everyday changes are in the short Content editor. Media, ordering, launch mode, and baseline operations are advanced controls.
- Editors are lazy-loaded, so visitors do not pay the admin bundle cost.
- Navigation warns before abandoning unsaved edits.
- Baseline restore is confirmed and moved out of the main header.
- Existing CMS fields are preserved when an editor saves a section.

### Public portfolio

- The home screen leads with a client outcome rather than only a technology list.
- Services, a four-step working process, selected work, capabilities, and contact are easy to scan.
- Case-study fields are optional. Only add outcomes or numbers that can be verified.
- Contact copy asks for goals, scope, timeline, and budget context without promising a result or a response time that is not configured.
- Images are lazy-loaded outside the first visual and external links reject placeholder `#` values.

### Analytics

- Analytics is first-party and opt-in. Visitors can allow or decline from the public site.
- Stored data uses a random tab-session ID and an allowlisted event vocabulary only. It does not store names, email addresses, inquiry text, IP addresses, user agents, URLs, titles, or fingerprints.
- The CMS Analytics tab shows anonymous visits, page views, active time, deep exploration, contact clicks, inquiries, section comparison, project interest, and daily trend.
- Section active time stops on hidden/unfocused tabs and caps each report at 15 seconds to avoid counting sleeping devices.
- MongoDB events expire after 90 days. Daily buckets use UTC. There is no historical backfill.

### Backend performance and safety

- Section reads use the existing Redis cache and lean Mongo reads.
- Analytics batches are capped at 20 events/16 KB and deduplicated by event ID.
- Analytics routes return `503` when Mongo is unavailable instead of claiming that data was stored.
- Media replacement uploads the new asset before removing the old one.
- The old development behavior that printed OTP credentials was removed.

## High-value next improvements

1. **Content proof** — Add one verified case study per strong project: problem, role, approach, and measurable outcome where evidence exists.
2. **Lead response** — Add a clear response expectation in CMS content only when it is operationally true, then add an email acknowledgement after testing deliverability.
3. **Image budget** — Export portraits/previews as AVIF/WebP, keep the hero image under roughly 150 KB, provide width/height, and avoid shipping unused frame sequences.
4. **Launch checklist** — Turn off Under Polishing, test the public form, test each project link, check mobile keyboard/focus states, and review the Analytics consent copy.
5. **Production analytics operations** — The current rate limiter is process-local. If the backend is deployed on multiple instances, move that small counter to the existing Redis integration.
6. **Search/share metadata** — Add a specific title, description, Open Graph image, canonical URL, and JSON-LD `Person`/`CreativeWork` data after the final public name and positioning are confirmed.

## Simple content model

Edit these fields first in the CMS:

- `home.profile.name`, `tagline`, `subtitle`, `ctaLabel`
- `home.profile.services[]` with `title`, `description`, and `deliverables[]`
- `about.aboutLines[]`
- `projects.projects[]` with a short description, stack, safe live/source links, and optional case-study fields
- `skills.skills` grouped by capability rather than claimed proficiency
- `contact` copy and placeholders

Keep the homepage to three to five services and two to four strong projects. Depth beats a long inventory.

## Free UI resources

Use these official, free/open-source sources. Check each license and attribution requirement before shipping a third-party asset.

| Resource | Best use | Link |
| --- | --- | --- |
| Tailwind CSS | Layout, responsive utilities, design tokens | https://tailwindcss.com/docs |
| shadcn/ui | Copy-owned accessible React components built on Tailwind/Radix | https://ui.shadcn.com/ |
| Radix Primitives | Unstyled accessible dialogs, menus, tabs, tooltips | https://www.radix-ui.com/primitives |
| Headless UI | Accessible disclosure, menu, dialog, listbox patterns | https://headlessui.com/ |
| Lucide | Consistent MIT-licensed line icons; already used here | https://lucide.dev/ |
| Heroicons | MIT-licensed SVG icons for simple marketing UI | https://heroicons.com/ |
| Phosphor Icons | Flexible open-source icon family with multiple weights | https://phosphoricons.com/ |
| Tabler Icons | Large MIT-licensed SVG icon set | https://tabler.io/icons |
| Unsplash Source / Unsplash | Placeholder or editorial photography; review Unsplash terms | https://unsplash.com/ |
| unDraw | Free customizable illustrations; review its license terms | https://undraw.co/ |
| Google Fonts | Free web fonts; self-host the final selection for performance | https://fonts.google.com/ |
| Coolors | Quick palette exploration; validate contrast before use | https://coolors.co/ |
| WebAIM Contrast Checker | Verify readable text and controls | https://webaim.org/resources/contrastchecker/ |

### Recommended minimal UI kit for this portfolio

Do not add all of the resources above. Keep the current stack and use Tailwind + Lucide + a small set of shadcn/Radix patterns only if a real interaction needs them. For this portfolio the useful primitives are:

- button and link variants: primary, quiet, destructive
- card with a stable heading/action row
- disclosure for optional case-study detail
- dialog for destructive baseline actions
- tabs/sidebar navigation in the CMS
- status/alert with `role="status"` or `role="alert"`

That keeps the UI minimal, reduces dependency weight, and makes changes predictable.

## How to use the new CMS

1. Open the admin portal and go to **Content**.
2. Update the name, headline, intro, CTA, services, and About paragraphs; save each card.
3. Open **Projects** to add only the work you want a client to remember. Use case-study disclosure for context, not filler.
4. Open **Skills** and keep categories understandable to a client.
5. Open **Analytics** after public traffic begins. Choose 7, 30, or 90 days.
6. Use **Settings** only for layout, media, polishing mode, and confirmed baseline operations.
