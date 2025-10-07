# Troubleshooting Guide

Common issues and solutions for the Reply Platform Dashboard.

## 📋 Table of Contents

- [Authentication Issues](#authentication-issues)
- [Build and Deployment](#build-and-deployment)
- [Development Problems](#development-problems)
- [API Integration](#api-integration)
- [UI and Display Issues](#ui-and-display-issues)
- [Performance Issues](#performance-issues)
- [Getting Help](#getting-help)

## Authentication Issues

### OAuth Callback Error: "No authorization code received"

**Symptoms:**
- Redirected to callback page with error
- Error message: "No authorization code received"

**Causes:**
1. User cancelled Google sign-in
2. Redirect URI mismatch
3. OAuth consent screen not configured

**Solutions:**

1. **Check Redirect URI**:
   ```bash
   # Verify .env.local
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

2. **Update Google Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to APIs & Services → Credentials
   - Edit OAuth 2.0 Client ID
   - Ensure redirect URI matches exactly

3. **Check OAuth Consent Screen**:
   - Ensure app is published or in test mode
   - Add test users if in test mode

### "Authentication failed" Error

**Symptoms:**
- Callback page shows "Failed to complete authentication"

**Causes:**
1. Invalid OAuth code (expired or already used)
2. API backend not accessible
3. Incorrect client ID or secret

**Solutions:**

1. **Check API Backend**:
   ```bash
   curl https://reply-platform-api.red-frog-895a.workers.dev/health
   ```

2. **Verify Environment Variables**:
   ```bash
   # Check client ID matches Google Console
   echo $NEXT_PUBLIC_GOOGLE_CLIENT_ID
   ```

3. **Clear Browser Data**:
   - Clear cookies and localStorage
   - Try incognito/private mode
   - Restart browser

### Token Expired or Invalid

**Symptoms:**
- Dashboard redirects to login
- API calls return 401 Unauthorized

**Causes:**
1. JWT token expired (24-hour lifetime)
2. Token corrupted in localStorage
3. API backend invalidated token

**Solutions:**

1. **Re-authenticate**:
   - Clear localStorage: `localStorage.clear()`
   - Login again

2. **Check Token in Console**:
   ```javascript
   // Open browser console
   console.log(localStorage.getItem('auth_token'));
   ```

3. **Decode JWT** (debugging):
   ```javascript
   const token = localStorage.getItem('auth_token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('Expires:', new Date(payload.exp * 1000));
   ```

## Build and Deployment

### Build Fails: "Output directory 'out' not found"

**Symptoms:**
- Cloudflare Pages build fails
- Error message mentions missing `/out` directory

**Solutions:**

1. **Verify Build Command**:
   - Cloudflare Pages dashboard
   - Build command should be: `npm run build`
   - Build output directory: `/out`

2. **Test Local Build**:
   ```bash
   npm install
   npm run build
   ls -la out/  # Should show files
   ```

3. **Check package.json**:
   ```json
   {
     "scripts": {
       "build": "next build"
     }
   }
   ```

4. **Verify next.config.js**:
   ```javascript
   module.exports = {
     output: 'export',
     // ...
   }
   ```

### Build Fails: "Module not found" or Dependency Errors

**Symptoms:**
- Build fails during npm install or compile
- Missing module errors

**Solutions:**

1. **Clear Cache and Reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Check Node Version**:
   ```bash
   node --version  # Should be >= 18.0.0
   ```

3. **Fix Dependency Conflicts**:
   ```bash
   npm audit fix
   npm install
   ```

### TypeScript Errors During Build

**Symptoms:**
- Build fails with type errors
- `tsc` compilation errors

**Solutions:**

1. **Run Type Check**:
   ```bash
   npm run type-check
   ```

2. **Fix Type Errors**:
   - Review error messages
   - Add proper type annotations
   - Fix any `any` types

3. **Verify tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "skipLibCheck": true
     }
   }
   ```

### Deployment Succeeds but Site Shows Errors

**Symptoms:**
- Build succeeds
- Site loads but shows blank page or errors

**Solutions:**

1. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Environment Variables**:
   - Check Cloudflare Pages dashboard
   - Ensure all `NEXT_PUBLIC_` vars are set
   - Redeploy after adding variables

3. **Check Static Export**:
   ```bash
   # Verify files in out/
   ls -la out/
   cat out/index.html  # Should have content
   ```

## Development Problems

### "npm run dev" Fails to Start

**Symptoms:**
- Dev server won't start
- Port 3000 already in use
- Module errors

**Solutions:**

1. **Kill Existing Process**:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use Different Port**:
   ```bash
   npm run dev -- -p 3001
   ```

3. **Check Dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Hot Reload Not Working

**Symptoms:**
- Changes not reflected in browser
- Need to manually refresh

**Solutions:**

1. **Restart Dev Server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Next.js Cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check File Watcher Limits** (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

### TypeScript Intellisense Not Working

**Symptoms:**
- No autocomplete in VS Code
- Type errors not shown

**Solutions:**

1. **Restart TypeScript Server**:
   - VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

2. **Check tsconfig.json**:
   - Ensure paths are correct
   - Verify `@/*` alias configured

3. **Install TypeScript**:
   ```bash
   npm install -D typescript @types/react @types/node
   ```

## API Integration

### API Calls Failing with CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API requests blocked

**Solutions:**

1. **Check API Backend CORS**:
   - Ensure backend allows origin
   - Development: Allow `http://localhost:3000`
   - Production: Allow `https://reply-platform-dashboard.pages.dev`

2. **Verify API URL**:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL);
   ```

3. **Test API Directly**:
   ```bash
   curl -X POST https://reply-platform-api.red-frog-895a.workers.dev/auth/google
   ```

### API Returns 401 Unauthorized

**Symptoms:**
- Authenticated requests fail
- "Failed to get user info" error

**Solutions:**

1. **Check Token**:
   ```javascript
   const token = localStorage.getItem('auth_token');
   console.log('Token:', token);
   ```

2. **Verify Authorization Header**:
   - Should be: `Bearer <token>`
   - Check API client in `src/lib/api.ts`

3. **Re-authenticate**:
   - Logout and login again
   - Token may be expired

### API Returns 500 Internal Server Error

**Symptoms:**
- Random 500 errors
- Backend errors

**Solutions:**

1. **Check API Backend Status**:
   - Visit API health endpoint
   - Check backend logs

2. **Verify Request Format**:
   - Ensure JSON payload is valid
   - Check required fields

3. **Contact Backend Team**:
   - Report issue with request details
   - Check API repository issues

## UI and Display Issues

### Styles Not Loading

**Symptoms:**
- Page loads but no CSS
- Looks unstyled

**Solutions:**

1. **Check Tailwind CSS**:
   ```bash
   # Verify build includes CSS
   ls -la out/_next/static/css/
   ```

2. **Clear Browser Cache**:
   - Hard reload: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Clear cache in DevTools

3. **Verify globals.css Imported**:
   - Check `src/app/layout.tsx`
   - Should import `./globals.css`

### Images Not Displaying

**Symptoms:**
- Broken image icons
- 404 for image files

**Solutions:**

1. **Check Image Path**:
   ```tsx
   // Images in public/ are served from root
   <img src="/reply-sh-logo-wide.png" alt="Logo" />
   ```

2. **Verify Image Exists**:
   ```bash
   ls -la public/reply-sh-logo-wide.png
   ```

3. **Check Next.js Config**:
   ```javascript
   // next.config.js
   images: {
     unoptimized: true  // Required for static export
   }
   ```

### Layout Issues on Mobile

**Symptoms:**
- Layout broken on small screens
- Elements overlapping

**Solutions:**

1. **Use Responsive Classes**:
   ```tsx
   <div className="flex flex-col md:flex-row">
   ```

2. **Test with Browser DevTools**:
   - Open DevTools
   - Toggle device toolbar
   - Test different screen sizes

3. **Check Viewport Meta Tag**:
   ```tsx
   // src/app/layout.tsx
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

## Performance Issues

### Slow Page Load

**Symptoms:**
- Pages take long to load
- Slow initial render

**Solutions:**

1. **Check Bundle Size**:
   ```bash
   npm run build
   # Review .next/analyze output
   ```

2. **Optimize Images**:
   - Use appropriate sizes
   - Compress images
   - Use WebP format

3. **Enable CDN Caching**:
   - Cloudflare automatically caches
   - Check cache headers

### High Memory Usage in Dev

**Symptoms:**
- Dev server slow
- Computer fans spinning

**Solutions:**

1. **Restart Dev Server**:
   ```bash
   npm run dev
   ```

2. **Clear .next Directory**:
   ```bash
   rm -rf .next
   ```

3. **Reduce Concurrent Processes**:
   - Close other apps
   - Limit browser tabs

## Getting Help

### Before Asking for Help

1. **Check Documentation**:
   - [README.md](README.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)
   - [API_REFERENCE.md](API_REFERENCE.md)
   - [CONTRIBUTING.md](CONTRIBUTING.md)

2. **Search Existing Issues**:
   - [GitHub Issues](https://github.com/fauzi-rachman/reply-platform-dashboard/issues)
   - Check closed issues too

3. **Gather Information**:
   - Error messages (full text)
   - Steps to reproduce
   - Environment (OS, Node version, browser)
   - Screenshots

### Creating a Bug Report

Include:

```markdown
**Describe the bug**
A clear description of what happened.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 18.17.0]
- npm Version: [e.g. 9.6.7]

**Additional context**
Any other relevant information.
```

### Getting Support

- **GitHub Issues**: [Create new issue](https://github.com/fauzi-rachman/reply-platform-dashboard/issues/new)
- **GitHub Discussions**: [Ask questions](https://github.com/fauzi-rachman/reply-platform-dashboard/discussions)
- **Documentation**: Check all docs in repository

### Emergency Issues

For critical production issues:

1. **Rollback Deployment**:
   - Use Cloudflare Pages dashboard
   - Rollback to last working version

2. **Disable Feature**:
   - Use feature flags if available
   - Deploy quick fix

3. **Report Immediately**:
   - Create GitHub issue with "CRITICAL" label
   - Include all details

## Common Error Messages

### "Error: ENOSPC: System limit for number of file watchers reached"

**Solution**:
```bash
# Linux only
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### "Module not found: Can't resolve '@/lib/api'"

**Solution**:
```bash
# Check tsconfig.json has paths configured
# Restart TypeScript server in IDE
# Restart dev server
```

### "Window is not defined"

**Solution**:
```typescript
// Ensure client-side only code uses:
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

### "Failed to compile. SyntaxError: Unexpected token"

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
