# Deployment Guide

Complete guide for deploying the Reply Platform Dashboard to Cloudflare Pages.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Deployment Testing](#local-deployment-testing)
- [Cloudflare Pages Setup](#cloudflare-pages-setup)
- [Automatic Deployments](#automatic-deployments)
- [Manual Deployments](#manual-deployments)
- [Troubleshooting](#troubleshooting)
- [Post-Deployment](#post-deployment)

## Overview

The Reply Platform Dashboard is a **static Next.js application** deployed to **Cloudflare Pages**. It uses:

- **Static Export**: Pre-rendered HTML/CSS/JS
- **CDN Distribution**: Global edge network
- **Automatic HTTPS**: SSL/TLS certificates
- **Git Integration**: Deploy on push to main

## Prerequisites

Before deploying, ensure you have:

### Required

- ✅ **GitHub Account**: Repository access
- ✅ **Cloudflare Account**: Free tier works
- ✅ **Node.js**: v18.0.0 or higher
- ✅ **Google OAuth Credentials**: Client ID and secret

### Optional

- 📦 **Wrangler CLI**: For manual deployments
- 🔐 **API Access**: Running Reply Platform API

## Environment Variables

### Required Variables

The application requires these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Reply Platform API endpoint | `https://reply-platform-api.red-frog-895a.workers.dev` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | `123456789-abc.apps.googleusercontent.com` |
| `NEXT_PUBLIC_REDIRECT_URI` | OAuth callback URL | `https://your-domain.pages.dev/auth/callback` |

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.pages.dev/auth/callback`
7. Copy the **Client ID**

### Environment File Setup

For local development:

```bash
# Copy example file
cp .env.example .env.local

# Edit with your values
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

For production, set these in the Cloudflare Pages dashboard (see below).

## Local Deployment Testing

Before deploying to production, test the build locally:

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

This creates a static export in the `/out` directory.

### 3. Verify Build Output

```bash
ls -la out/
```

You should see:
- `index.html` - Home page
- `_next/` - Next.js assets
- `auth/callback/index.html` - OAuth callback
- `dashboard/index.html` - Dashboard
- `login/index.html` - Login page

### 4. Test Locally (Optional)

```bash
# Serve the static files
npx serve out

# Or use Python
python3 -m http.server 8000 --directory out
```

Open http://localhost:8000 and verify:
- ✅ Pages load correctly
- ✅ Styles are applied
- ✅ Navigation works
- ✅ No 404 errors in browser console

## Cloudflare Pages Setup

### Option 1: Automatic Setup (Recommended)

This is the easiest method - Cloudflare auto-deploys from GitHub.

#### 1. Connect Repository

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select your GitHub repository: `reply-platform-dashboard`
5. Click **Begin setup**

#### 2. Configure Build Settings

Set the following in the Cloudflare Pages setup:

```
Production branch: main
Build command: npm run build
Build output directory: /out
Root directory: /
Build system version: 3 (latest)
```

#### 3. Set Environment Variables

In the **Environment variables** section:

**For Production:**
```
NEXT_PUBLIC_API_URL = https://reply-platform-api.red-frog-895a.workers.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID = your_google_client_id
NEXT_PUBLIC_REDIRECT_URI = https://reply-platform-dashboard.pages.dev/auth/callback
```

**For Preview (optional):**
```
NEXT_PUBLIC_API_URL = https://reply-platform-api.red-frog-895a.workers.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID = your_google_client_id
NEXT_PUBLIC_REDIRECT_URI = https://preview.reply-platform-dashboard.pages.dev/auth/callback
```

#### 4. Deploy

1. Click **Save and Deploy**
2. Cloudflare will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to CDN

#### 5. Verify Deployment

Once complete, you'll see:
- ✅ **Deployment URL**: `https://reply-platform-dashboard.pages.dev`
- ✅ **Build logs**: Check for any errors
- ✅ **Live site**: Click to preview

### Option 2: Manual Setup with Wrangler CLI

For advanced users or manual deployments:

#### 1. Install Wrangler

```bash
npm install -g wrangler
```

#### 2. Authenticate

```bash
wrangler login
```

This opens a browser to authenticate with Cloudflare.

#### 3. Build Locally

```bash
npm run build
```

#### 4. Deploy

```bash
npm run deploy
# or
wrangler pages deploy out
```

#### 5. Configure Project

First deployment will prompt you to:
- Choose a project name
- Select production branch

Subsequent deployments use the same configuration.

## Automatic Deployments

Once set up with Git integration, deployments are automatic:

### Production Deployments

**Trigger**: Push to `main` branch

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

Cloudflare automatically:
1. Detects the push
2. Runs `npm run build`
3. Deploys to production URL
4. Updates live site

**URL**: `https://reply-platform-dashboard.pages.dev`

### Preview Deployments

**Trigger**: Push to any non-main branch or open PR

```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Cloudflare automatically:
1. Builds the branch
2. Deploys to preview URL
3. Comments on PR with preview link

**URL**: `https://abc123.reply-platform-dashboard.pages.dev`

### Deployment Status

Monitor deployments in:
- **Cloudflare Dashboard**: Real-time build logs
- **GitHub Actions**: Build status badges
- **Email Notifications**: Build success/failure

## Manual Deployments

For manual control or CI/CD integration:

### Using npm Script

```bash
# Build and deploy in one command
npm run deploy
```

### Using Wrangler Directly

```bash
# Build first
npm run build

# Deploy to production
wrangler pages deploy out --project-name=reply-platform-dashboard

# Deploy to preview
wrangler pages deploy out --branch=preview
```

### CI/CD Integration

For GitHub Actions or other CI/CD:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          NEXT_PUBLIC_REDIRECT_URI: ${{ secrets.REDIRECT_URI }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy out --project-name=reply-platform-dashboard
```

## Troubleshooting

### Build Fails: "Output directory 'out' not found"

**Cause**: Build command not configured or failed

**Solution**:
1. Check Cloudflare Pages build settings
2. Ensure build command is: `npm run build`
3. Verify package.json has build script
4. Check build logs for errors

### Build Fails: "Configuration file does not support 'build'"

**Cause**: Invalid wrangler.toml configuration

**Solution**:
1. Remove `[build]` section from wrangler.toml
2. Use Cloudflare Pages dashboard settings instead
3. Current valid wrangler.toml:
   ```toml
   name = "reply-platform-dashboard"
   compatibility_date = "2023-12-18"
   pages_build_output_dir = "out"
   ```

### Environment Variables Not Working

**Cause**: Variables not set or incorrect prefix

**Solution**:
1. Verify variables in Cloudflare Pages dashboard
2. Ensure `NEXT_PUBLIC_` prefix for client-side vars
3. Redeploy after adding variables
4. Check browser console for undefined values

### OAuth Redirect Mismatch

**Cause**: Redirect URI doesn't match Google Console

**Solution**:
1. Check `NEXT_PUBLIC_REDIRECT_URI` matches deployed URL
2. Update Google Console authorized redirect URIs
3. Include both production and preview URLs:
   - `https://reply-platform-dashboard.pages.dev/auth/callback`
   - `https://*.reply-platform-dashboard.pages.dev/auth/callback`

### 404 on Page Refresh

**Cause**: Static export doesn't support dynamic routes

**Solution**:
1. Use `trailingSlash: true` in next.config.js (already set)
2. Ensure all routes are pre-rendered
3. Check `/out` directory has all route HTML files

### Slow Build Times

**Cause**: Large dependencies or slow network

**Solution**:
1. Use `npm ci` instead of `npm install`
2. Enable Cloudflare Pages build cache
3. Optimize dependencies
4. Consider reducing bundle size

### CSS Not Loading

**Cause**: Build issue or incorrect paths

**Solution**:
1. Verify `_next/static/` exists in `/out`
2. Check browser console for 404s
3. Ensure `unoptimized: true` in next.config.js
4. Clear Cloudflare cache

## Post-Deployment

### Custom Domain Setup

1. Go to Cloudflare Pages → Your Project
2. Click **Custom domains**
3. Add your domain (e.g., `dashboard.example.com`)
4. Cloudflare provides DNS records
5. Add CNAME record to your DNS:
   ```
   CNAME dashboard.example.com reply-platform-dashboard.pages.dev
   ```
6. SSL certificate auto-provisioned

### Update OAuth Redirect URIs

After adding custom domain:

1. Go to Google Cloud Console
2. Update OAuth redirect URIs:
   - Add: `https://dashboard.example.com/auth/callback`
3. Update environment variables:
   ```
   NEXT_PUBLIC_REDIRECT_URI = https://dashboard.example.com/auth/callback
   ```
4. Redeploy

### Monitor Performance

Use Cloudflare Analytics to track:
- **Page views**
- **Unique visitors**
- **Bandwidth usage**
- **Cache hit rate**
- **Response times**

### Enable Firewall Rules

Protect your deployment:

1. Go to Cloudflare → Firewall
2. Add rules to:
   - Block specific countries
   - Rate limit requests
   - Challenge suspicious traffic
   - Block known bots

### Set Up Alerts

Configure notifications:

1. Go to Cloudflare → Notifications
2. Enable alerts for:
   - Build failures
   - High error rates
   - SSL certificate expiration
   - Unusual traffic patterns

## Rollback

If a deployment has issues:

### Via Cloudflare Dashboard

1. Go to Pages → Deployments
2. Find the working deployment
3. Click **...** → **Rollback to this deployment**

### Via Git

```bash
# Revert the commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

### Via Wrangler

```bash
# List deployments
wrangler pages deployment list

# Promote a specific deployment
wrangler pages deployment tail <deployment-id>
```

## Best Practices

1. ✅ **Test locally** before deploying
2. ✅ **Use preview deployments** for testing
3. ✅ **Monitor build logs** for warnings
4. ✅ **Keep dependencies updated**
5. ✅ **Enable HTTPS only**
6. ✅ **Set up custom domain**
7. ✅ **Configure firewall rules**
8. ✅ **Monitor analytics**

## Related Documentation

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Architecture Guide](ARCHITECTURE.md)
