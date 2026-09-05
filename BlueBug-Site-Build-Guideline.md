# BlueBug — Production Build Guideline & Specification
**For: AI coding model executing this build**
**Purpose: This is the single source of truth. Do not deviate, do not invent features not listed here, do not skip any section marked NON-NEGOTIABLE.**

---

## 0. READ THIS FIRST — RULES FOR THE MODEL BUILDING THIS

1. **Do not hallucinate content.** Every project's data, links, and descriptions must come from Section 6 (Content Inventory) exactly as written. If a field is marked `TBD`, leave it empty/null in the database — do NOT invent a placeholder value, fake link, fake metric, or fake testimonial.
2. **Do not skip error handling to "get it working."** Every endpoint, every form, every API call must handle failure states explicitly. A working happy-path with no error handling is an INCOMPLETE task, not a done task.
3. **Do not use inline styles or random one-off colors.** Use only the design tokens defined in Section 2. If a token doesn't exist for something you need, stop and flag it instead of inventing a color.
4. **Build in the order given in Section 10 (Build Order).** Do not jump ahead to polish/animation before the backend + data model + core pages are working and tested.
5. **After each milestone, self-check against the checklist in Section 9 before moving to the next.**
6. **Comment backend Python code in the Hinglish style shown in Section 11.** This is a real requirement, not optional — the team reading this code speaks like this daily.
7. **This is a production deliverable for a real consultancy business.** No placeholder Lorem Ipsum text on final pages, no broken links, no console errors, no "TODO" left in shipped code.

---

## 1. PROJECT OVERVIEW

**Client:** BlueBug — a tech consultancy startup founded by 2 co-founders, working with project-specific contractors.

**What this site is:** A portfolio + lead-generation site. It showcases real, shipped work (custom sites, apps, PWAs, AI/ML systems, data engineering, hospital/institutional information systems) with the goal of making a visitor impressed enough to book a consultation call.

**Core principle:** The project case studies ARE the sales pitch. This is not a generic marketing site with a "portfolio" tab bolted on — the work IS the site's main content and selling point.

**Architecture:** Headless — Django REST Framework backend (content API, admin, lead capture) + Next.js frontend (the actual visual experience). This split is deliberate: new projects get added later through Django admin with zero frontend redeploys.

---

## 2. BRAND & DESIGN SYSTEM

### 2.1 Logo
- BlueBug logo: a bug icon fused with a padlock body (rounded, single-weight outline stroke). Represents security + reliability, not just "bug" as in insect/glitch.
- Logo file provided by founders — use as-is. Do not redraw or reinterpret it.
- Favicon: use the bug+lock icon alone (no wordmark), cropped tight, exported at 32x32, 180x180 (apple-touch-icon), and 512x512 (PWA-style manifest icon even though the site itself isn't a PWA — good practice for bookmarking/sharing).
- Clear-space rule: minimum padding around logo = height of the bug icon's antenna line, on all sides.
- Never stretch, recolor, rotate, or add drop-shadows/effects to the logo mark.

### 2.2 Color Tokens (exact — sampled from actual logo file)

```css
:root {
  /* Brand */
  --bb-primary: #1481F8;        /* exact sampled brand blue from logo */
  --bb-primary-hover: #3D9AFA;  /* lighter, for hover states */
  --bb-primary-active: #0D6FDB; /* darker, for active/pressed states */
  --bb-primary-glow: rgba(20, 129, 248, 0.35); /* for glow/shadow effects on dark bg */

  /* Base (dark-first) */
  --bb-bg: #0A0E14;             /* near-black base background */
  --bb-bg-elevated: #12161F;    /* card/section background, one step up */
  --bb-bg-elevated-2: #191E29;  /* nested cards, modals */
  --bb-border: #242A38;         /* subtle borders on dark */
  --bb-border-hover: #363E52;

  /* Text on dark */
  --bb-text-primary: #F4F6FA;
  --bb-text-secondary: #A6ADBB;
  --bb-text-muted: #6B7280;

  /* Status/badges */
  --bb-success: #34D399;   /* "Live" badge */
  --bb-neutral-badge: #A6ADBB; /* "GitHub" badge */
  --bb-warning: #FBBF24;   /* "In Progress" badge */

  /* Light mode (secondary, if toggled — dark is default) */
  --bb-bg-light: #FFFFFF;
  --bb-bg-elevated-light: #F5F7FA;
  --bb-text-primary-light: #10131A;
  --bb-text-secondary-light: #4B5563;
}
```

Rule: **dark mode is the default and primary experience.** A light mode toggle is a nice-to-have (build after core is done, not before), but if included, MUST reuse the same token names above via a `data-theme="light"` attribute swap — do not create a second, divergent color system.

### 2.3 Typography
- Primary typeface: **Inter** (or General Sans / Satoshi if licensing allows — pick one, use consistently everywhere, do not mix).
- Load via `next/font` (Next.js built-in font optimization) — never via a slow external `<link>` tag that causes layout shift.
- Scale (use CSS variables, not hardcoded px in components):
  - `--text-hero`: clamp(2.5rem, 5vw, 4.5rem), weight 700
  - `--text-h1`: clamp(2rem, 3.5vw, 3rem), weight 700
  - `--text-h2`: clamp(1.5rem, 2.5vw, 2.25rem), weight 600
  - `--text-h3`: 1.25rem, weight 600
  - `--text-body`: 1rem, weight 400, line-height 1.6
  - `--text-small`: 0.875rem, weight 400

### 2.4 Visual Language Rules
- Rounded corners throughout (matches the logo's rounded strokes) — cards `border-radius: 16px`, buttons `border-radius: 10px`, badges `border-radius: 999px` (pill).
- Icon set: use an outline-style icon library (e.g., `lucide-react`) with stroke-width matched visually to the logo's line weight. Do not mix filled icons and outline icons.
- Bento-grid layout for the homepage project showcase — asymmetric card sizes, not a uniform grid.
- Motion: subtle only. Fade+slide-up on scroll into view (use `framer-motion` or CSS `@keyframes` with `IntersectionObserver`), hover states with 150–200ms ease transitions. NO auto-playing carousels, no aggressive parallax, no flashy page transitions that delay content.
- Glass/blur accents used sparingly — e.g., sticky nav bar (`backdrop-filter: blur(12px)` over translucent dark background), not on every card.

---

## 3. FULL SITEMAP

```
/                       Home
/work                   Projects listing (filterable grid)
/work/[slug]            Individual project case study page (dedicated page per project, always)
/services               Services page
/about                  About (founders + how we work)
/contact                Contact / Book a call
/privacy                Privacy policy (required — has a lead-capture form)
```

No blog/insights section in v1 (deliberate scope decision — can be added later as a `/insights` app without touching existing structure). No multi-language toggle in v1 — site copy in English; individual project case studies (e.g., HindiASR) can naturally mention Hindi-language context in their content without the whole site needing i18n infrastructure.

---

## 4. PAGE-BY-PAGE SPECIFICATION

### 4.1 Home (`/`)
1. **Nav bar** — sticky, blurred background on scroll. Logo (mark + wordmark) left, links center/right (Work, Services, About, Contact), primary button "Book a Call" always visible.
2. **Hero** — headline + subtext + two CTAs ("Book a Call" primary button, "See Our Work" secondary/ghost button). Keep hero copy honest and specific to what BlueBug actually does — no generic "innovative solutions for tomorrow" filler.
3. **Trust strip** — row of tech-stack icons (Django, PostgreSQL, React/Next.js, AI/ML-related icon) with small label "Technologies we build with" — substitutes for client logos until testimonials/logos exist.
4. **Featured work bento grid** — the 4 flagship projects (StudioIkonic, DawaiSathi, ResQ, HindiASR) as bento cards, mixed sizes, each showing: project image/screenshot, name, one-line tagline, category tag, live/GitHub badges. Click → case study page. This is the visual centerpiece — most design effort should go here.
5. **Services overview** — 6 cards (icon + title + 1-line description): Custom Websites, Custom Apps, PWAs, AI/ML Solutions, Data Engineering, Institutional/Healthcare Systems. Each links to its anchor on `/services`.
6. **How we work** — short 3–4 step process strip (e.g., Discover → Design → Build → Ship & Support).
7. **Final CTA banner** — full-width, "Have a project in mind? Let's talk." + Book a Call button.
8. **Footer** — logo, nav links, contact email, social/GitHub org link, copyright.

### 4.2 Work / Projects (`/work`)
- Filter chips at top: All / Web Apps / PWAs / AI-ML / Data / Healthcare Systems (values = `Project.category` choices — see Section 5).
- Grid of ALL projects (not just the 4 flagship — this page is the growing archive the founder specifically wants).
- Each card: cover image, name, one-line tagline, category tag, status badges (Live / GitHub / both / neither — see badge logic below).
- Click any card → `/work/[slug]`.
- Empty/loading states must be handled gracefully (skeleton loaders while fetching from API, a clean "no projects match this filter" message — never a blank white screen or console error visible to the user).

**Badge logic (must be implemented exactly like this):**
```
if project.live_url exists:      show "● Live" badge (green dot)
if project.github_url exists:    show "GitHub" badge (with GitHub icon)
if neither exists:                show no badge row at all — 
                                   the case study itself (screenshots/video) 
                                   must carry the proof instead
```

### 4.3 Project Case Study (`/work/[slug]`)
This is the most important page on the site. Structure, top to bottom:
1. Back-to-work link.
2. Header: project name, one-line tagline, category tag, status badges, and — right up top, no scrolling required — action buttons: "View Live" (if `live_url`) and "View Code" (if `github_url`). If neither exists, this row is simply omitted, no broken/disabled buttons shown.
3. **Problem** — what problem this project solves (from `Project.problem_statement`).
4. **Approach** — what BlueBug built and why, technical decisions worth highlighting (from `Project.approach`).
5. **Tech stack** — visual row of icons + labels (from `Project.tech_stack`, a tag list).
6. **Gallery** — screenshot carousel or grid (from `Project.images`), embedded demo video if present (from `Project.demo_video_url`).
7. **Key features** — bullet list (from `Project.key_features`).
8. **Outcome/impact** — only rendered if `Project.outcome` is filled in; do not fabricate metrics if empty.
9. Optional: "Team on this project" small credit line (from `Project.team_credit`, nullable — omit block entirely if empty).
10. CTA: "Want something like this built?" → Book a Call.
11. "More projects" — 3-card strip of other projects, excluding the current one.

### 4.4 Services (`/services`)
For each of the 6 services: name, description, what's typically included, and — critically — a "See it in action" link pointing to the real project that proves this capability (e.g., AI/ML section → links to `/work/hindiasr`). This turns marketing copy into evidence.

### 4.5 About (`/about`)
- Founders section: 2 cards (photo, name, role, one honest line each about what they actually do day-to-day).
- Short "how we staff projects" paragraph: core team stays constant; specialist contractors join per project based on what it needs. Framed as a strength (right expertise per problem), not an excuse.
- No full contractor roster page in v1.

### 4.6 Contact (`/contact`)
- Primary: embedded booking widget (Calendly or similar embed — leave the actual embed code as a clearly marked placeholder `{{CALENDLY_EMBED}}` since founders will provide their real Calendly link).
- Secondary: a lead-capture form (name, email, message, optional "which service are you interested in" dropdown) that POSTs to the `Lead` API endpoint — for people who'd rather not book a call immediately.
- Tertiary: direct email + WhatsApp link, quietly placed (e.g., footer of this page), not competing visually with the primary CTA.
- Form MUST have: client-side validation, server-side validation (never trust client-side alone), a clear success state, a clear error state (e.g., "Something went wrong, please email us directly at X" — never a silent failure), and rate limiting on the backend endpoint to block spam floods.

---

## 5. DJANGO DATA MODELS (exact field specification)

```python
# apps/projects/models.py
# ---------------------------------------------------------------
# Yaha par sab projects ka data store hota hai. Naya project 
# add karna ho to bas Django admin se karo, code touch mat karo.
# ---------------------------------------------------------------

from django.db import models
from django.utils.text import slugify

class Project(models.Model):
    CATEGORY_CHOICES = [
        ("web", "Web App"),
        ("pwa", "PWA"),
        ("ai_ml", "AI/ML"),
        ("data", "Data Engineering"),
        ("healthcare", "Healthcare / Institutional System"),
    ]
    STATUS_CHOICES = [
        ("live", "Live"),
        ("in_progress", "In Progress"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=200)
    # slug auto-generate hoga title se, agar admin khud kuch na de
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    tagline = models.CharField(max_length=280)  # ek line ka hook
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="live")

    problem_statement = models.TextField()
    approach = models.TextField()
    key_features = models.JSONField(default=list, blank=True)  # list of strings
    tech_stack = models.JSONField(default=list, blank=True)    # list of strings, e.g. ["Django","React"]
    outcome = models.TextField(blank=True, null=True)  # agar nahi pata to blank hi rehne do, kabhi fake mat likhna

    live_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    demo_video_url = models.URLField(blank=True, null=True)

    cover_image = models.ImageField(upload_to="projects/covers/")
    # gallery images alag model me — neeche dekho

    team_credit = models.CharField(max_length=300, blank=True, null=True)

    is_featured = models.BooleanField(default=False)  # home page bento grid ke liye
    display_order = models.PositiveIntegerField(default=0)  # manual sorting control

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def save(self, *args, **kwargs):
        # slug ek baar set ho jaye to change nahi karna, warna purane links tut jayenge
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    # ek project ki multiple gallery images — cover_image se alag
    project = models.ForeignKey(Project, related_name="gallery_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=200, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Testimonial(models.Model):
    # optional hai — jab tak client testimonial na mile, ye table khali reh sakta hai
    project = models.ForeignKey(Project, related_name="testimonials", on_delete=models.SET_NULL, null=True, blank=True)
    client_name = models.CharField(max_length=150)
    client_role = models.CharField(max_length=150, blank=True, null=True)
    client_company = models.CharField(max_length=150, blank=True, null=True)
    quote = models.TextField()
    client_photo = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    is_published = models.BooleanField(default=False)  # draft rakh sakte ho jab tak review na ho jaye


# apps/services/models.py
class ServiceOffering(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    icon_name = models.CharField(max_length=100)  # lucide-react icon name, e.g. "code-2"
    short_description = models.CharField(max_length=280)
    full_description = models.TextField()
    proof_project = models.ForeignKey(
        "projects.Project", null=True, blank=True, on_delete=models.SET_NULL,
        help_text="Kaunsa project isko prove karta hai — 'See it in action' link ke liye"
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order"]


# apps/leads/models.py
class Lead(models.Model):
    # ---------------------------------------------------------------
    # Ye humara mini-CRM hai. Har contact form submission yahan aata hai.
    # Kabhi bhi is table ko public expose mat karna kisi bhi API me.
    # ---------------------------------------------------------------
    STATUS_CHOICES = [
        ("new", "New"),
        ("contacted", "Contacted"),
        ("closed", "Closed"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    interested_service = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    source_page = models.CharField(max_length=200, blank=True, null=True)  # kis page se aaya
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


# apps/team/models.py
class TeamMember(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio_line = models.CharField(max_length=280)  # ek honest line, generic fluff nahi
    photo = models.ImageField(upload_to="team/")
    is_founder = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order"]
```

---

## 6. CONTENT INVENTORY (real data — use exactly as given, do not embellish)

> Fields marked `TBD` must be confirmed with the founders before launch. Leave the corresponding database field blank/null — never invent a value.

### Project 1 — StudioIkonic
- Category: `web` (Custom Website)
- Status: **Live**
- Live URL: `https://studioikonic.co`
- GitHub URL: `https://github.com/Ayaan-Saifi-1/Iconic.Design`
- One-line: Portfolio website for Iconic.Design, an interior design company.
- `is_featured`: true

### Project 2 — DawaiSathi
- Category: `ai_ml` or `healthcare` — **TBD, confirm with founders exactly what the product does** (name suggests a medicine/health companion app; do not guess further detail beyond what's confirmed)
- Status: In Progress (deployed link currently inactive, expected live "in a few days" per founder — set `status="in_progress"` and leave `live_url` blank until confirmed active)
- GitHub: organization-based, multiple versioned repos — latest is `https://github.com/Project-eigen/version-4`. Note the org root: `https://github.com/Project-eigen`
- Nice detail worth surfacing in the case study: this project has visible version iteration (v1→v4) in its repo history — display as a small "evolution" note in the case study if founders confirm they want that shown.

### Project 3 — ResQ
- Category: `pwa` (disaster management + alert/notification system — strong PWA candidate given offline/low-connectivity use case)
- Live URL: **TBD**
- GitHub URL: **TBD**
- Description basis: disaster management platform with alert and notification system.

### Project 4 — HindiASR
- Category: `ai_ml`
- Live URL: **TBD**
- GitHub URL: **TBD**
- Description basis: speech-to-text system for Indian courts — live court sessions get transcribed and stored as evidentiary/precedent record for court proceedings. This is likely the single most technically impressive project in the portfolio (hard problem: Hindi ASR + legal-grade accuracy/record-keeping) — case study should be given generous space even without a live demo link; lean on screenshots/architecture diagrams/video walkthrough for proof.

**For all 4:** `problem_statement`, `approach`, `key_features`, `tech_stack`, and gallery images must be gathered from the founders before the case study pages go live — this document does not fabricate that detail. Do not publish a case study page with empty problem/approach fields; keep it in draft (`is_featured=False`, or a `draft` flag if you add one) until content is ready.

---

## 7. BACKEND ARCHITECTURE (Django + DRF + PostgreSQL)

### 7.1 Project structure
```
bluebug-backend/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   ├── staging.py
│   │   └── prod.py
│   ├── urls.py
│   └── wsgi.py / asgi.py
├── apps/
│   ├── projects/
│   ├── services/
│   ├── leads/
│   ├── team/
│   └── core/          # shared utilities, custom exception handler, base serializers
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── manage.py
└── .env.example
```

### 7.2 NON-NEGOTIABLE reliability requirements
- **Settings split by environment** (`dev.py` / `staging.py` / `prod.py` inheriting from `base.py`). `DEBUG=True` must be structurally impossible in `prod.py`.
- **Custom DRF exception handler** in `apps/core/exceptions.py` — every error returns clean, consistent JSON (`{"error": "message", "code": "..."}`,  never a raw Django/Python traceback to the client. Log the full traceback server-side (see logging below), return a safe message to the client.
- **Serializer-level validation on every writable field** — especially the `Lead` (contact form) endpoint: validate email format, message length limits, strip/sanitize input.
- **Rate limiting** on `POST /api/leads/` using DRF throttling (`AnonRateThrottle`, e.g. max 5 submissions/hour/IP) — stops spam floods.
- **CORS configured explicitly** (`django-cors-headers`) — only allow the actual frontend domain(s), never `CORS_ALLOW_ALL_ORIGINS=True` in prod.
- **Database**: PostgreSQL, connection pooling enabled, migrations committed to version control, never edited by hand in production. Automated daily backups turned on at the hosting provider level (Railway/Render both support this — must be explicitly enabled, it's usually opt-in).
- **Logging**: structured logging to stdout (so the hosting platform captures it) at minimum; **Sentry** (free tier) wired in for `prod.py` and `staging.py` so exceptions alert the team instead of going unnoticed.
- **Health check endpoint**: `GET /api/health/` — returns `200 OK` with a basic DB-connectivity check, used by the hosting platform's uptime monitor.
- **Image uploads**: validate file type and size server-side before accepting (`django-imagekit` or manual validators) — never trust the frontend to have already validated this.
- **Static/media files**: served via Cloudinary or S3 in production (not local filesystem) — local storage on most PaaS platforms is ephemeral and images WILL vanish on redeploy if this is skipped.
- **Secrets**: all keys/passwords via environment variables (`.env`, loaded with `django-environ` or similar) — nothing hardcoded, nothing committed to git. Provide a `.env.example` with dummy values as a template.

### 7.3 API Endpoints (DRF)

```
GET   /api/projects/                 List all projects (supports ?category= filter, ?featured=true)
GET   /api/projects/{slug}/          Single project detail (full case study data)
GET   /api/services/                 List all service offerings
GET   /api/team/                     List team members
GET   /api/testimonials/             List published testimonials only (is_published=True filter enforced server-side, never client-side)
POST  /api/leads/                    Submit contact form (rate-limited, validated)
GET   /api/health/                   Health check
```

All list endpoints: paginated (DRF `PageNumberPagination`), even though current data is small — this is a "never crash later" requirement, not a v1 nicety, since the founder explicitly wants the project list to keep growing.

All read endpoints: public, no auth required. `POST /api/leads/` is the only write endpoint exposed publicly, and it is throttled. Django admin itself sits behind normal Django session auth + staff permission group ("Editors" group: add/change on Project, ProjectImage, ServiceOffering, Testimonial, TeamMember; view-only or no access to Lead's sensitive fields if you want extra care, though as 2 co-founders both can likely just have full staff access).

### 7.4 Admin panel
Install **django-unfold** (or `django-admin-interface` as fallback) for a modern admin UI — both founders will be using this directly to add projects, so it must not feel like raw 2005-Django. Register all models with sensible `list_display`, `search_fields`, and inline `ProjectImage` editing directly on the `Project` admin page (use `TabularInline`).

---

## 8. FRONTEND ARCHITECTURE (Next.js)

### 8.1 Structure
```
bluebug-frontend/
├── app/
│   ├── page.tsx                 # Home
│   ├── work/
│   │   ├── page.tsx              # Projects listing
│   │   └── [slug]/page.tsx       # Case study
│   ├── services/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── privacy/page.tsx
├── components/
│   ├── ui/                       # buttons, badges, cards — atomic, reusable
│   ├── sections/                 # hero, bento-grid, cta-banner, etc.
│   └── layout/                   # navbar, footer
├── lib/
│   ├── api.ts                    # typed fetch wrappers to Django API
│   └── types.ts                  # TypeScript types matching DRF serializers exactly
├── public/
└── next.config.js
```

### 8.2 Rules
- **TypeScript, strictly typed** — `lib/types.ts` must mirror the DRF serializer output field-for-field. No `any` types on API data.
- **Server Components by default** for data-fetched pages (case studies, listings) — better SEO, faster initial paint. Only mark components `"use client"` when they actually need interactivity (filters, forms, animations).
- **Every `fetch()` to the Django API wrapped in try/catch**, with a typed error state rendered in the UI (never an unhandled promise rejection / blank white screen).
- **Loading states**: skeleton components for listing/case-study pages while data loads.
- **SEO**: `generateMetadata()` per case-study page using the project's real title/tagline/cover image — this is where organic search traffic will come from (e.g., someone searching about Hindi court transcription should be able to find the HindiASR case study).
- **Images**: `next/image` everywhere (automatic optimization, no layout shift), never raw `<img>` tags.
- **Forms**: contact form built with client-side validation (e.g., `zod` + `react-hook-form`) mirroring the backend's validation rules exactly, so users get instant feedback before hitting the API.
- **No PWA manifest/service worker** — confirmed out of scope for v1 per founder decision. Standard responsive site only.
- **Environment variables**: `NEXT_PUBLIC_API_URL` for the Django API base — never hardcode the API domain in component code.

---

## 9. PRODUCTION-READY SELF-CHECK CHECKLIST
*(Model: run through this before considering ANY milestone done)*

- [ ] Does every API call have a loading state, success state, AND error state handled in the UI?
- [ ] Does the backend return clean JSON errors, never a raw stack trace, on any failure?
- [ ] Is `DEBUG=False` guaranteed in the production settings file?
- [ ] Are all secrets in environment variables, none hardcoded or committed?
- [ ] Is the contact form rate-limited server-side?
- [ ] Are database migrations committed and clean (no manual edits)?
- [ ] Do images load via `next/image` with proper `alt` text (accessibility + SEO)?
- [ ] Does the site work with zero projects in the database without crashing (empty state)?
- [ ] Does the site work with a project that has no `live_url` and no `github_url` (badge row correctly omitted, no broken buttons)?
- [ ] Is CORS locked to the real frontend domain only?
- [ ] Are all colors/spacing pulled from the design tokens in Section 2, nothing hardcoded ad-hoc?
- [ ] Does every page have correct `<title>` / meta description for SEO?
- [ ] Has Sentry (or equivalent) been wired in for prod error alerts?
- [ ] Is there a working health-check endpoint for uptime monitoring?

---

## 10. BUILD ORDER (do not skip ahead)

1. Django project scaffold + settings split (dev/staging/prod) + PostgreSQL connection.
2. Data models (Section 5) + migrations + Django admin registration + django-unfold styling.
3. DRF serializers + API endpoints (Section 7.3) + custom exception handler + throttling on leads endpoint.
4. Seed real content for StudioIkonic (the only project with complete confirmed data) via admin — use this as the test case end-to-end.
5. Next.js scaffold + design tokens (Section 2) as global CSS variables + typography setup.
6. Layout components: navbar, footer.
7. Build `/work` listing page + `/work/[slug]` case study page against the real API — get one project (StudioIkonic) rendering perfectly end-to-end before building the rest.
8. Build Home page (hero, bento grid, services overview, CTA).
9. Build Services, About, Contact pages.
10. Wire up the contact form fully (frontend validation + backend submission + success/error states).
11. Add remaining project entries via admin (DawaiSathi, ResQ, HindiASR) as their content becomes available from founders — do not block the whole site launch waiting on all 4 being fully written up; StudioIkonic + partial others is fine to launch with, provided incomplete ones are marked draft/unpublished rather than shown broken.
12. Polish pass: animations, hover states, responsive/mobile QA, accessibility pass (keyboard nav, alt text, color contrast).
13. Run through Section 9 checklist fully before deployment.
14. Deploy (Section 12), verify health-check + Sentry + backups are actually live, not just configured.

---

## 11. CODE COMMENT STYLE GUIDE (Hinglish)

Backend Python code comments should be written the way the team actually talks — natural Hindi-English mix, not overly formal, not childish either. Examples of the tone to match (already used in Section 5's models above):

```python
# Yaha par sab projects ka data store hota hai. Naya project 
# add karna ho to bas Django admin se karo, code touch mat karo.

# slug ek baar set ho jaye to change nahi karna, warna purane links tut jayenge

# Ye humara mini-CRM hai. Har contact form submission yahan aata hai.
# Kabhi bhi is table ko public expose mat karna kisi bhi API me.

# agar nahi pata to blank hi rehne do, kabhi fake mat likhna
```

Rules for this style:
- Use it for **explanatory comments** (why something is done, what a field/function is for, warnings to future devs) — not for every single line.
- Keep technical terms (model names, function names, HTTP methods, library names) in English — only the explanatory language around them is Hinglish. Don't translate "ForeignKey" or "serializer," for example.
- Docstrings on complex functions can follow the same tone, kept brief.
- Frontend (TypeScript/React) code can use the same style for non-obvious logic comments, but keep it lighter — frontend code tends to be more self-explanatory with good component/variable naming.
- **Never** apply this style to user-facing site copy — all visitor-facing text stays professional English, this is purely an internal code-readability convention for the team.

---

## 12. DEPLOYMENT & HOSTING

- **Backend + PostgreSQL**: Railway (or Render as alternative) — enable automated daily Postgres backups explicitly in project settings (not on by default).
- **Frontend**: Vercel — connects directly to the Next.js repo, auto-deploys on push to `main`, preview deployments on PRs.
- **Media/images**: Cloudinary (free tier is generous for a portfolio site's image volume) — Django's `ImageField` should point here via `django-cloudinary-storage`, not local disk.
- **Error monitoring**: Sentry free tier, one project for backend, one for frontend.
- **Domain**: once founders finalize domain purchase, point it at Vercel (frontend) with the backend on a subdomain like `api.bluebug.xyz` (adjust to actual domain once chosen).
- **Environment variables**: set directly in Railway/Vercel dashboards for each environment — never in committed code.

---

## 13. OPEN ITEMS (must be resolved with founders before full launch, not blockers for development start)

- Final domain name and confirmed availability (BlueBug name check — note: "bluebugging" is an existing Bluetooth-security-exploit term; unrelated to this brand but worth a quick trademark/SEO-collision check before hard-committing).
- ResQ and HindiASR: confirm live/GitHub links, or confirm they'll launch with screenshots/video-only proof.
- DawaiSathi: confirm exact product description and category (currently placeholder-categorized as AI/ML or Healthcare — needs founder confirmation).
- Real Calendly (or equivalent) booking link for the Contact page embed.
- Founder photos + bio lines for the About page.
- Final problem/approach/key-features copy for each case study (this document intentionally does not fabricate this — it must come from the founders who know the real story).

---

*End of specification. Build exactly to this document. Where information is marked TBD, leave the corresponding fields empty in the database rather than inventing content — an honest incomplete case study can be finished later; a fabricated one damages the exact trust this site exists to build.*
