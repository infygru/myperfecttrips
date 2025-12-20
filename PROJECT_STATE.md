# MyPerfectTrips - Project Master Blueprint

## 1. Technical Architecture
- **Framework:** Next.js 14+ (App Router).
- **Styling:** Tailwind CSS (Modern, Minimalist, Whiter-than-white theme).
- **Backend:** Directus CMS (Self-hosted/Cloud).
- **API Access:** `@directus/sdk` using `rest()` and `readSingleton`/`readItems`.

## 2. Visual Identity & Design Language
- **Core Theme:** High-end travel consultancy, clean, bright, and professional.
- **Colors:**
  - Primary: Royal Blue (`#3b82f6`).
  - Secondary: Light Blue (`#60a5fa`).
  - Logo Colors: Red and Blue (Must stand out against white).
- **Navbar Style:** - Background: `bg-white/95` with `backdrop-blur-md` (Whiter as possible).
  - Animation: Scroll-triggered auto-resize (Shrinks height and logo size on scroll).
  - Button: `bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]` with `rounded-xl`.
- **UI Constraints:** No heavy shadows; use clean `border-slate-100` and `rounded-3xl` for cards.

## 3. Directus Data Model
- **Global_Settings:** (Singleton) - **CRITICAL:** Case-sensitive 'S'.
  - Field: `logo` (UUID for file asset).
- **Packages:** Fields include `title`, `slug`, `image`, `description`, `price`, `duration`.
- **Blog_Posts:** News and updates collection.
- **Enquiries:** Standard contact leads.
- **package_enquiries:** Specialized leads for Visas and Holiday Packages.

## 4. Implementation Status (75% Complete)
- [x] **Server-Side Navbar:** Logo fetched via `readSingleton('Global_Settings')` on server to avoid CORS/Fetch errors.
- [x] **Animated Header:** `NavbarClient` handles scroll-resize logic and "Whiter" blurry background.
- [x] **Footer:** Professional multi-column layout with white logo-box.
- [x] **Schengen Visa Page:** Landing page with dedicated lead form and `#1e3a8a` background.
- [x] **AI Chatbot:** "MyPerfectTrips" professional concierge logic with lead capture.
- [x] **Blog:** Listing with pill-style category filters.

## 5. Remaining Roadmap (25% To Go)
1. **Packages Listing Page:** Responsive grid fetching live data from the `Packages` collection.
2. **Package Detail Pages:** Dynamic `[slug]` routes for detailed itineraries.
3. **Destination Landing Pages:** SEO-focused pages for major regions.
4. **Lead Management:** Testing form submissions to `package_enquiries`.