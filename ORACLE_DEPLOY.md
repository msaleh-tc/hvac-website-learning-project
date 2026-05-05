# Deploying to Oracle Cloud + Coolify — Step by Step

This guide migrates ComfortAir Pro from Vercel + Neon to a self-hosted setup on Oracle Cloud's **always-free** tier with Coolify.

**What you get**: Production + Development environments, PostgreSQL with connection pooling, Redis caching, automatic SSL, free domain — all for $0/month, forever.

---

## Architecture

```
Internet
  │
  ├── https://hvac-prod.duckdns.org ──→ Coolify/Traefik (reverse proxy + SSL)
  │                                          │
  │                                     app-prod (:3000)
  │                                      ├── PgBouncer → PostgreSQL (prod)
  │                                      └── Redis (db 0)
  │
  └── https://hvac-dev.duckdns.org ───→ Coolify/Traefik
                                             │
                                        app-dev (:3001)
                                         ├── PgBouncer → PostgreSQL (dev)
                                         └── Redis (db 1)

All on ONE Oracle Cloud VM (4 CPUs, 24GB RAM, 200GB disk)
```

---

## Step 1: Create Oracle Cloud Account (5 minutes)

1. Go to https://www.oracle.com/cloud/free/
2. Click **Start for Free**
3. Fill in your details — a credit card is required for verification but **will NOT be charged**
4. Select your **Home Region** — choose the closest to UAE:
   - **Saudi Arabia West (Jeddah)** — closest
   - **UAE East (Dubai)** — if available
   - **India West (Mumbai)** — backup option
5. Complete registration and wait for account activation (usually instant, sometimes up to 30 minutes)

**Important**: Oracle's Always Free tier never expires and never charges your card, as long as you stay within free limits.

---

## Step 2: Create a Free VM Instance (10 minutes)

1. Log in to Oracle Cloud Console: https://cloud.oracle.com
2. Click **Create a VM instance**
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `hvac-server` |
| **Image** | Ubuntu 22.04 (or 24.04) |
| **Shape** | Ampere A1 (ARM) — **Always Free** |
| **OCPUs** | 4 (max free) |
| **Memory** | 24 GB (max free) |
| **Boot volume** | 200 GB (max free) |
| **Network** | Create new VCN, assign public IP |

4. **SSH Key**: Click "Generate a key pair" and **download both keys** (save them somewhere safe)
5. Click **Create**
6. Wait for the instance to be **Running** (1-2 minutes)
7. Copy the **Public IP Address** from the instance details

---

## Step 3: Configure Oracle Cloud Firewall (2 minutes)

Oracle has TWO firewalls — the VM's iptables AND the cloud network security list. You need to open ports in BOTH.

### Cloud Network Security List:

1. In Oracle Console → Networking → Virtual Cloud Networks
2. Click your VCN → Click the subnet → Click the Security List
3. Add **Ingress Rules**:

| Source CIDR | Protocol | Dest Port | Description |
|-------------|----------|-----------|-------------|
| 0.0.0.0/0 | TCP | 80 | HTTP |
| 0.0.0.0/0 | TCP | 443 | HTTPS |
| 0.0.0.0/0 | TCP | 8000 | Coolify Dashboard |

4. Click **Add Ingress Rules**

---

## Step 4: SSH Into the VM & Install Coolify (5 minutes)

```bash
# From your laptop terminal:
# (Replace the IP and key path with your actual values)

chmod 400 ~/Downloads/ssh-key.key
ssh -i ~/Downloads/ssh-key.key ubuntu@YOUR_VM_PUBLIC_IP
```

Once connected to the VM:

```bash
# Run the setup script (downloads and runs on the VM)
# Option A: If you've cloned the repo on the VM
git clone https://github.com/msaleh-tc/hvac-website-learning-project.git
cd hvac-website-learning-project
bash docker/scripts/setup-oracle.sh

# Option B: One-liner without cloning
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
sudo docker network create web 2>/dev/null || true
```

After installation, **open in your browser**:
```
http://YOUR_VM_PUBLIC_IP:8000
```

Create your Coolify admin account (first user to visit becomes admin).

---

## Step 5: Set Up Free Domains with DuckDNS (3 minutes)

DuckDNS gives you free subdomains that point to your server's IP. No approval needed.

1. Go to https://www.duckdns.org
2. Sign in with GitHub, Google, or Twitter
3. Create two subdomains:
   - `hvac-prod` → points to your Oracle VM's public IP
   - `hvac-dev` → points to the same IP
4. Note your **DuckDNS token** (shown on the dashboard)

Your domains are now:
- `hvac-prod.duckdns.org` → Production
- `hvac-dev.duckdns.org` → Development

### Auto-Update IP (in case Oracle changes it):

On the VM, set up a cron job:

```bash
# SSH into VM, then:
(crontab -l 2>/dev/null; echo "*/5 * * * * curl -s 'https://www.duckdns.org/update?domains=hvac-prod,hvac-dev&token=YOUR_DUCKDNS_TOKEN&ip=' > /dev/null") | crontab -
```

---

## Step 6: Deploy via Coolify Dashboard (10 minutes)

### 6A. Connect Your GitHub Repository

1. In Coolify dashboard → **Sources** → Add GitHub App
2. Follow the OAuth flow to connect your GitHub account
3. Select the `hvac-website-learning-project` repository

### 6B. Create the Production Application

1. **Projects** → New Project → Name it "HVAC Website"
2. **New Resource** → **Docker Compose**
3. **Source**: GitHub → select your repo
4. **Docker Compose file**: `docker-compose.prod.yml`
5. **Environment Variables** — add these:

```
DB_PROD_PASSWORD=<generate: openssl rand -base64 24>
DB_DEV_PASSWORD=<generate: openssl rand -base64 24>
PROD_DOMAIN=hvac-prod.duckdns.org
DEV_DOMAIN=hvac-dev.duckdns.org
PROD_NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
DEV_NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
```

6. **Domains** configuration:
   - `app-prod` service → Domain: `https://hvac-prod.duckdns.org`
   - `app-dev` service → Domain: `https://hvac-dev.duckdns.org`

7. Click **Deploy**

Coolify will:
- Build the Docker image from your Dockerfile
- Start all 7 containers (2x PostgreSQL, 2x PgBouncer, Redis, 2x App)
- Automatically provision SSL certificates via Let's Encrypt
- Configure Traefik reverse proxy to route traffic to the correct app

### 6C. Initialize the Databases

After deployment is running, SSH into the VM:

```bash
# Enter the app-prod container
sudo docker exec -it $(sudo docker ps -qf "name=app-prod") sh

# Run migrations
npx prisma migrate deploy

# Seed the database
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const adminHash = await bcrypt.hash('admin123456', 12);
  const customerHash = await bcrypt.hash('customer123456', 12);
  await prisma.user.upsert({ where: { email: 'admin@comfortairpro.com' }, update: {}, create: { email: 'admin@comfortairpro.com', name: 'Admin User', passwordHash: adminHash, role: 'ADMIN', phone: '555-0100' }});
  await prisma.user.upsert({ where: { email: 'demo@example.com' }, update: {}, create: { email: 'demo@example.com', name: 'Jane Smith', passwordHash: customerHash, role: 'CUSTOMER', phone: '555-0200', address: '123 Oak Street' }});
  console.log('Seeded!');
}
main().finally(() => prisma.\$disconnect());
"
exit
```

Repeat for dev:
```bash
sudo docker exec -it $(sudo docker ps -qf "name=app-dev") sh
npx prisma migrate deploy
# (same seed script as above)
exit
```

---

## Step 7: Verify Everything Works

Open in your browser:

| Environment | URL | Test Login |
|-------------|-----|-----------|
| **Production** | https://hvac-prod.duckdns.org | admin@comfortairpro.com / admin123456 |
| **Development** | https://hvac-dev.duckdns.org | admin@comfortairpro.com / admin123456 |

### Verify the stack:

```bash
# SSH into VM and check all containers are running
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Expected: 7 containers all showing "Up" and "(healthy)"
# - db-prod, db-dev
# - pgbouncer, pgbouncer-dev
# - redis
# - app-prod, app-dev
```

---

## Step 8: Set Up Automatic Deployments (2 minutes)

In Coolify:
1. Go to your project → Settings
2. Enable **Auto Deploy** on push to `main` branch
3. Set the branch to `main`

Now every `git push origin main` automatically:
1. Pulls latest code
2. Rebuilds Docker image
3. Restarts containers with zero-downtime deployment
4. No manual deploy needed

For dev environment, you can set it to auto-deploy on the `develop` branch.

---

## Step 9: Set Up Monitoring (Optional, 5 minutes)

### Uptime Monitoring with Uptime Kuma (free, self-hosted):

In Coolify → New Resource → **One-click** → Search "Uptime Kuma" → Deploy

Configure monitors for:
- `https://hvac-prod.duckdns.org` — check every 60 seconds
- `https://hvac-dev.duckdns.org` — check every 300 seconds
- PostgreSQL prod — TCP check on internal port
- Redis — TCP check on internal port

### Resource Monitoring:

```bash
# Quick check from SSH
htop                    # CPU and memory usage
sudo docker stats       # Per-container resource usage
df -h                   # Disk usage
```

---

## What's Running — Resource Breakdown

| Container | RAM Usage | CPU Usage | Purpose |
|-----------|-----------|-----------|---------|
| PostgreSQL prod | ~100-200 MB | Low | Production database |
| PostgreSQL dev | ~100-200 MB | Low | Development database |
| PgBouncer prod | ~5-10 MB | Minimal | Connection pooling (prod) |
| PgBouncer dev | ~5-10 MB | Minimal | Connection pooling (dev) |
| Redis | ~50-256 MB (capped) | Minimal | Caching (both envs) |
| App prod (Next.js) | ~150-300 MB | Medium | Production website |
| App dev (Next.js) | ~150-300 MB | Medium | Dev website |
| Coolify + Traefik | ~300-500 MB | Low | Management + reverse proxy |
| **Total** | **~1-2 GB** | **Low** | **Out of 24 GB available** |

You're using less than 10% of the available RAM. There's room for 10x more services.

---

## Deployment Workflow

### Ship a New Feature:

```bash
# 1. Work on develop branch
git checkout develop
# ... make changes ...
git add -A && git commit -m "feat: new feature"
git push origin develop
# → Coolify auto-deploys to https://hvac-dev.duckdns.org

# 2. Test on dev environment
# Open https://hvac-dev.duckdns.org and verify

# 3. Merge to production
git checkout main
git merge develop
git push origin main
# → Coolify auto-deploys to https://hvac-prod.duckdns.org
```

### Rollback:

In Coolify dashboard → Deployments → click any previous deployment → **Redeploy**

---

## Maintenance Checklist (Monthly, ~15 minutes)

```bash
# SSH into VM

# 1. Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# 2. Check disk usage (should be well under 200GB)
df -h

# 3. Clean old Docker images
sudo docker image prune -f

# 4. Check container health
sudo docker ps

# 5. Check logs for errors
sudo docker logs --tail 50 $(sudo docker ps -qf "name=app-prod")
```

---

## Comparison: Before vs After

| Metric | Before (Vercel + Neon) | After (Oracle + Coolify) |
|--------|----------------------|------------------------|
| **Monthly cost** | $0 (hobby, non-commercial) | $0 (forever, commercial OK) |
| **Cold starts** | 200-500ms | 0ms |
| **DB query latency** | 50-200ms (network to Singapore) | 1-5ms (local) |
| **Redis latency** | N/A (no Redis) | <0.1ms (local) |
| **Max request duration** | 10 seconds | Unlimited |
| **WebSocket support** | No | Yes (when needed) |
| **Background jobs** | No | Yes (when needed) |
| **Connection pooling** | Neon pooler (external) | PgBouncer (local, sub-ms) |
| **Storage** | 0.5 GB (Neon free) | 200 GB (Oracle free) |
| **RAM** | N/A (serverless) | 24 GB |
| **Commercial use** | Requires paid plan | Free forever |
