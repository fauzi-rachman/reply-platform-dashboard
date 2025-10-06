# Cloudflare Pages Deployment Guide

## Issues Fixed

### 1. Missing Build Command
**Problem**: Cloudflare Pages deployment failed with "Output directory 'out' not found."
**Root Cause**: Build command needs to be configured in Cloudflare Pages dashboard, not wrangler.toml
**Solution**: Configure build settings in Cloudflare Pages dashboard

### 2. Invalid wrangler.toml Configuration
**Problem**: "Configuration file for Pages projects does not support 'build'" error
**Root Cause**: `[build]` section is not supported in wrangler.toml for Pages projects
**Solution**: Removed `[build]` section from wrangler.toml

## Current Configuration

### Cloudflare Pages Dashboard Settings
```
Build command: npm run build
Build output directory: /out
Root directory: /
```

### package.json
```json
"engines": {
  "node": ">=18.0.0"
}
```

## Environment Variables

The following environment variables are configured in wrangler.toml for runtime:

- `NEXT_PUBLIC_API_URL`: API endpoint URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID  
- `NEXT_PUBLIC_REDIRECT_URI`: OAuth redirect URI

**Important**: Build-time environment variables should be set in the Cloudflare Pages dashboard under "Environment variables" section, not in wrangler.toml's `[build.env]` (which is not supported for Pages).

## Deployment Process

1. **Configure Cloudflare Pages**: Set build settings in the dashboard:
   - Build command: `npm run build`
   - Build output directory: `/out`
   - Root directory: `/`
   - Build system version: `3 (latest)`

2. **Local Testing**: Always test the build locally first:
   ```bash
   npm install
   npm run build
   ```

3. **Verify Output**: Ensure the `out` directory is created and contains:
   - `index.html`
   - `_next/` directory with assets
   - All route directories (auth/, dashboard/, etc.)

4. **Deploy**: Push to GitHub - Cloudflare Pages will:
   - Automatically detect the wrangler.toml configuration
   - Use dashboard build settings (not wrangler.toml build section)
   - Deploy static files from the `out` directory

## Troubleshooting

### Build Fails
- Check Node.js version compatibility (>=18.0.0)
- Verify all dependencies are installed
- Check for TypeScript errors

### Environment Variables Not Working
- Ensure they start with `NEXT_PUBLIC_` for client-side usage
- Verify they're set in the correct environment section (production/preview)

### Static Export Issues
- The app is configured for static export (`output: 'export'`)
- Server-side features (API routes, ISR) are disabled
- Images are set to `unoptimized: true`

## Next Steps

The dashboard should now deploy successfully to Cloudflare Pages with:
- Proper build process
- Static file generation
- Environment variables configured
- OAuth callback handling