# MyPerfectTrips — Hostinger KVM2 VPS Setup Guide

## Prerequisites on VPS
- Ubuntu 22.04 LTS
- 2 vCPU / 8GB RAM (KVM2)
- Root SSH access

---

## 1. Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install essentials
apt install -y git curl ufw fail2ban

# Firewall setup
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose plugin
apt install -y docker-compose-plugin
```

---

## 2. Clone Repository

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_GITHUB_USERNAME/myperfecttrips.git
cd myperfecttrips
```

---

## 3. Create Production Environment File

```bash
cp .env.production.example .env.production
nano .env.production   # Fill in real values
```

Required values:
```
NEXT_PUBLIC_SITE_URL=https://myperfecttrips.com
NEXT_PUBLIC_DIRECTUS_URL=https://admin.myperfecttrips.com
DIRECTUS_API_TOKEN=your_real_token_here
```

---

## 4. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot

# Get certificate (stop nginx first if running)
certbot certonly --standalone -d myperfecttrips.com -d www.myperfecttrips.com

# Auto-renewal (add to crontab)
echo "0 3 * * * certbot renew --quiet && docker compose -f /var/www/myperfecttrips/docker-compose.yml restart nginx" | crontab -
```

---

## 5. Deploy with Docker Compose

```bash
cd /var/www/myperfecttrips
docker compose up -d --build
docker compose ps   # Verify all containers running
```

---

## 6. Verify Deployment

```bash
# Check app is running
curl -I http://localhost:3000

# Check nginx is routing correctly
curl -I https://myperfecttrips.com

# View logs
docker compose logs -f myperfecttrips
docker compose logs -f nginx
```

---

## 7. CI/CD via GitHub Actions

Add these **Repository Secrets** in GitHub Settings → Secrets → Actions:

| Secret              | Value                              |
|---------------------|------------------------------------|
| `VPS_HOST`          | Your VPS IP address                |
| `VPS_USER`          | `root` or your SSH user            |
| `VPS_SSH_KEY`       | Your private SSH key               |
| `VPS_PORT`          | `22` (or custom SSH port)          |
| `NEXT_PUBLIC_DIRECTUS_URL` | `https://admin.myperfecttrips.com` |
| `DIRECTUS_API_TOKEN` | Your Directus API token           |

After adding secrets, every push to `main` will auto-deploy.

---

## 8. SEO Submission

After deployment:

1. **Google Search Console**: https://search.google.com/search-console
   - Add property: `https://myperfecttrips.com`
   - Submit sitemap: `https://myperfecttrips.com/sitemap.xml`

2. **Bing Webmaster Tools**: https://www.bing.com/webmasters
   - Add site: `https://myperfecttrips.com`
   - Submit sitemap: `https://myperfecttrips.com/sitemap.xml`

3. **Google Page Speed Insights**: https://pagespeed.web.dev
   - Test: `https://myperfecttrips.com`

---

## Maintenance Commands

```bash
# Pull latest code and redeploy
cd /var/www/myperfecttrips && bash deploy.sh

# View running containers
docker compose ps

# Restart specific service
docker compose restart myperfecttrips

# Check disk usage
df -h

# Check memory
free -h

# Check container resources
docker stats
```
