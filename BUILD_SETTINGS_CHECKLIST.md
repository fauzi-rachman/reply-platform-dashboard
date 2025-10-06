# Cloudflare Pages Build Settings Checklist

Based on your build settings screenshot, verify these configurations in your Cloudflare Pages dashboard:

## ✅ Current Settings (from screenshot)
- **Build command**: `npm run build` ✅
- **Build output directory**: `/out` ✅  
- **Root directory**: `/` ✅
- **Build system version**: `3 (latest)` ✅

## Environment Variables to Set (if not already done)

In the Cloudflare Pages dashboard, under Environment Variables, ensure these are set for **Production**:

```
NEXT_PUBLIC_API_URL = https://reply-platform-api.red-frog-895a.workers.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID = 764998904028-961vabephjihi48j199ss8fiqtcudng1.apps.googleusercontent.com
NEXT_PUBLIC_REDIRECT_URI = https://reply-platform-dashboard.pages.dev/auth/callback
```

And for **Preview** (staging):
```
NEXT_PUBLIC_API_URL = https://reply-platform-api.red-frog-895a.workers.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID = 764998904028-961vabephjihi48j199ss8fiqtcudng1.apps.googleusercontent.com
NEXT_PUBLIC_REDIRECT_URI = https://reply-platform-dashboard.pages.dev/auth/callback
```

## What We Fixed
1. ❌ Removed invalid `[build]` section from wrangler.toml
2. ❌ Removed invalid `[build.env]` section from wrangler.toml
3. ✅ Kept only the supported configurations:
   - `pages_build_output_dir = "out"`
   - Environment variables for runtime

## Next Deployment Should Work
With the corrected wrangler.toml (no build section) and your dashboard build settings, the deployment should now succeed.

The build process will:
1. Use the dashboard build command (`npm run build`)
2. Generate static files in the `out` directory  
3. Deploy the contents of `out` as your static site
4. Apply runtime environment variables from wrangler.toml