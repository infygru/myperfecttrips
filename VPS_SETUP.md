# MyPerfectTrips — Coolify Deployment Guide (Hostinger KVM2)

Coolify is already installed on the VPS and manages all sites via its built-in
Traefik reverse proxy. No manual nginx or SSL setup is needed.

---

## How Deployment Works

```
GitHub push to main
       ↓
Coolify detects change (webhook)
       ↓
Coolify builds Docker image (using Dockerfile)
       ↓
Coolify starts container (port 3000 internally)
       ↓
Traefik routes myperfecttrips.com → container
       ↓
Let's Encrypt SSL handled automatically by Coolify
```

---

## Setting Up the Project in Coolify

1. **Create a new Resource** in your Coolify project
2. **Select**: "Docker Compose" or "Dockerfile" as build pack
   - If you choose **Dockerfile**: Coolify uses the `Dockerfile` directly
   - If you choose **Docker Compose**: Coolify uses `docker-compose.yml` (app-only, no nginx)
3. **Connect GitHub repo**: `infygru/myperfecttrips`, branch `main`
4. **Set port**: `3000`
5. **Add domain**: `myperfecttrips.com` and `www.myperfecttrips.com`
   - Enable "Force HTTPS" in Coolify UI
   - Enable "WWW to non-WWW redirect" (or apex to www — pick one consistently)
6. **Auto-deploy**: Enable "Deploy on push"

---

## Environment Variables (Set in Coolify UI)

Go to your resource → **Environment Variables** tab and add:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
NEXT_PUBLIC_SITE_URL=https://myperfecttrips.com
NEXT_PUBLIC_DIRECTUS_URL=https://admin.myperfecttrips.com
DIRECTUS_API_TOKEN=your_directus_api_token_here
```

Do NOT use `.env.production` file — set everything in Coolify UI for security.

---

## Triggering a Redeploy

Any push to the `main` branch automatically redeploys via Coolify webhook.

To manually redeploy: Coolify Dashboard → your resource → **Redeploy** button.

---

## Sharing the VPS with Other Sites

Coolify handles this automatically. Each site runs in its own container with
its own network. Traefik routes traffic based on domain name. No port conflicts.

---

## SEO Submission (After Deployment)

1. **Google Search Console**: https://search.google.com/search-console
   - Add property: `https://myperfecttrips.com`
   - Verify via DNS TXT record (easiest with Hostinger DNS panel)
   - Submit sitemap: `https://myperfecttrips.com/sitemap.xml`

2. **Bing Webmaster Tools**: https://www.bing.com/webmasters
   - Add site, verify, submit sitemap

3. **PageSpeed Insights**: https://pagespeed.web.dev
   - Test both mobile and desktop for `https://myperfecttrips.com`

---

## Useful Commands (SSH into VPS if needed)

```bash
# View Coolify-managed containers
docker ps

# Check logs for the app container
docker logs <container_name> --tail 100 -f

# Check resource usage
docker stats

# Restart a specific container (prefer using Coolify UI)
docker restart <container_name>
```
