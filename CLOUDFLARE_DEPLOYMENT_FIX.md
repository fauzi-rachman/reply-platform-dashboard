# Cloudflare Pages Deployment Guide

## Issues Fixed

### 1. Missing Build Command
**Problem**: Cloudflare Pages deployment failed with "Output directory 'out' not found."
**Root Cause**: No build command specified in wrangler.toml
**Solution**: Added `[build]` section with `command = "npm run build"`

### 2. Build Configuration
**Added**: 
- Build command configuration
- Build environment variables
- Node.js engine specification

## Current Configuration

### wrangler.toml
```toml
[build]
command = "npm run build"
cwd = ""

[build.env]
NODE_ENV = "production"
```

### package.json
```json
"engines": {
  "node": ">=18.0.0"
}
```

## Environment Variables

The following environment variables are configured for production deployment:

- `NEXT_PUBLIC_API_URL`: API endpoint URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `NEXT_PUBLIC_REDIRECT_URI`: OAuth redirect URI

## Deployment Process

1. **Local Testing**: Always test the build locally first:
   ```bash
   npm install
   npm run build
   ```

2. **Verify Output**: Ensure the `out` directory is created and contains:
   - `index.html`
   - `_next/` directory with assets
   - All route directories (auth/, dashboard/, etc.)

3. **Deploy**: Use Cloudflare Pages deployment
   - The build command will automatically run during deployment
   - Static files will be served from the `out` directory

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