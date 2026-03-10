# IGHolidays - AI Assistant Memory Sheet

**Purpose:** Provide this entire document as your first prompt to any AI assistant (ChatGPT, Claude, Gemini, etc.) before asking them to write code or debug issues for the IGHolidays repository. It contains the complete "brain" of how this project is structured.

---

## 1. Tech Stack Overview
- **Frontend Framework:** Next.js 14/15 App Router (`src/app`)
- **Language:** TypeScript 100%
- **Styling:** Tailwind CSS v4 (Pure utility classes, NO custom CSS files except `globals.css`)
- **UI Components:** React Server Components (default) with strict `'use client'` boundaries for interactivity.
- **Icons:** `lucide-react`
- **Backend / Headless CMS:** Directus v11.16+ (Self-hosted on Coolify VPS)
- **Database:** PostgreSQL (Attached to Directus)
- **Deployment Platform:** Coolify (Nixpacks builder for Next.js, Docker Compose for Directus/Postgres)

---

## 2. Design Philosophy & Aesthetics
- **Theme:** "Premium Luxury Travel Agency"
- **Color Palette:** Emerald Green (`emerald-600` to `emerald-900`), Gold/Amber accents (`amber-500`), and Stone/Slate Dark Luxury gradients.
- **Forbidden Colors:** DO NOT use generic Blues, pure Reds, or flat bright colors.
- **Styling Rules:** 
  - Use glassmorphism (`bg-white/80 backdrop-blur-md`).
  - Use subtle borders (`border-stone-200/50`).
  - Implement smooth micro-animations (`hover:scale-105 transition-all duration-300`).
  - Keep it clean, minimalist, and enterprise-grade.

---

## 3. Directus Backend Architecture
The backend is a strictly headless Directus CMS. The Next.js frontend fetches data RESTfully via the `@directus/sdk`.

### Environment Variables
- **Next.js (Coolify):** `NEXT_PUBLIC_DIRECTUS_URL=https://api.igholidays.com`
- **Directus (Coolify):** `CORS_ORIGIN=https://igholidays.com,http://localhost:3000`

### Core Collections (Tables)
1. **`site_settings`**: Stores global data (Logo, Favicon, Phone, Hero Video, Tagline).
   - *Quirk:* In Directus, this was created as an Array. The frontend `src/lib/directus.ts` file uses a custom fallback function `getSiteSettings()` that strictly extracts `[0]` so it doesn't crash Next.js.
2. **`packages`**: The core travel products. Contains relation to `directus_files` for the main `image` and an alias to `packages_files` for the `gallery`.
3. **`blog_posts`**: SEO marketing articles.
4. **`leads`**: General contact form submissions.
5. **`flight_enquiries`**: Submissions from the Hero section "Flights" search tab.
6. **`holiday_enquiries`**: Submissions from the Hero section "Holidays" search tab.

### Public Permissions
In the Directus Dashboard (`Settings -> Access Policies -> Public`), the following permissions MUST be green:
- **Read (View):** `packages`, `site_settings`, `blog_posts`, `directus_files` (System Collection)
- **Create (Add):** `leads`, `enquiries`, `flight_enquiries`, `holiday_enquiries`

---

## 4. Next.js Frontend Architecture

### Data Fetching Rules
- **Directus SDK:** Always import the initialized client from `import { directus } from "@/lib/directus";`.
- **Server Components:** Data fetching must happen in Server Components (`page.tsx` or Server Actions).
- **Caching:** Next.js aggressively caches fetch requests. We enforce real-time data from Directus by using:
  ```typescript
  import { unstable_noStore as noStore } from "next/cache";
  // Inside component:
  noStore();
  ```
- **Error Handling:** Always wrap Directus data fetching in `try/catch` and `console.error` the exact failure. NEVER use empty catch blocks, or Coolify logs will silently swallow deployment connection issues.

### Server Actions (Form Submissions)
All forms (Lead, Contact, Flight, Holiday) submit data using Next.js Server Actions located in `src/actions/`.
- The Client Component (`<form action={submitAction}>`) calls the Server Action.
- The Server Action uses the Directus `@directus/sdk` `createItem()` function to push data securely to the backend.

### Image/Video Handling Rules
- All media comes from Directus. Next.js `next/image` requires the domain to be whitelisted.
- `next.config.ts` must contain `remotePatterns` allowing `**` (all domains) for HTTPS to support live Directus file URLs.
- Directus files are accessed via: `https://api.igholidays.com/assets/[UUID-OF-FILE]`.

---

## 5. Deployment Quirks (Coolify & VPS)
- **Build Memory Limits:** We are running on a low-RAM VPS. If Next.js fails to build on Coolify with an "OOM" (Out Of Memory) error, you must ensure ESLint and TypeScript checking are disabled during the build phase in `next.config.ts`.
- **Standalone Mode:** Do NOT use `output: "standalone"` in `next.config.ts`. Coolify's Nixpacks builder for Next.js 16 natively handles the start command (`next start`).
- **Backend Folder:** There is a `/backend` folder in the root repository. It contains local SQLite/Postgres data and local uploads. **Ignore it.** It is not deployed to the live server; it simply exists for local development reference.

---

*End of Memory Sheet.*
