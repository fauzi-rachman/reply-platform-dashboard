# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Reply Platform Dashboard team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities by emailing:

**Email**: security@reply.sh (or create a private security advisory on GitHub)

### What to Include

Please include the following information in your report:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up

### Example Report

```
Subject: [SECURITY] XSS Vulnerability in Dashboard

Description:
Found a potential XSS vulnerability in the website management form.

Steps to Reproduce:
1. Login to dashboard
2. Add website with payload: <script>alert('xss')</script>
3. Payload executes when viewing website list

Impact:
- Allows attackers to execute arbitrary JavaScript
- Could steal user tokens
- Affects all users viewing the website list

Suggested Fix:
Sanitize user input before rendering in the UI

Contact:
researcher@example.com
```

## Response Timeline

- **Initial Response**: Within 48 hours
- **Confirmation**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

## Security Update Process

1. **Confirmation**: We confirm the vulnerability
2. **Development**: We develop a fix
3. **Testing**: We test the fix thoroughly
4. **Deployment**: We deploy to production
5. **Disclosure**: We publish security advisory (coordinated with reporter)

## Public Disclosure

We follow a **coordinated disclosure** process:

1. **Private Fix**: We fix the issue privately
2. **Deploy**: We deploy the fix to production
3. **Public Advisory**: We publish a security advisory
4. **Credit**: We credit the reporter (if desired)

We ask security researchers to:
- Give us reasonable time to fix the issue
- Not publicly disclose until fix is deployed
- Not exploit the vulnerability

## Security Best Practices

### For Users

1. **Keep Updated**: Use the latest version
2. **Secure Credentials**: Use strong passwords
3. **OAuth Only**: Prefer Google OAuth over passwords
4. **Logout**: Logout when done on shared devices
5. **HTTPS**: Always access via HTTPS

### For Developers

1. **Input Validation**: Sanitize all user input
2. **XSS Prevention**: Escape output properly
3. **CSRF Protection**: Use CSRF tokens
4. **Secure Dependencies**: Keep dependencies updated
5. **Code Review**: Review all code changes

## Known Security Measures

### Authentication

- ✅ **OAuth 2.0**: Industry-standard authentication
- ✅ **JWT Tokens**: Stateless, signed tokens
- ✅ **HTTPS Only**: All traffic encrypted
- ✅ **Token Expiration**: 24-hour token lifetime
- ✅ **Secure Storage**: Tokens in localStorage (HTTPS only)

### API Security

- ✅ **CORS**: Proper cross-origin policies
- ✅ **Rate Limiting**: API rate limits
- ✅ **Input Validation**: All inputs validated
- ✅ **SQL Injection**: Parameterized queries
- ✅ **Authentication Required**: Most endpoints require auth

### Infrastructure

- ✅ **Cloudflare CDN**: DDoS protection
- ✅ **SSL/TLS**: Automatic HTTPS
- ✅ **Static Export**: No server-side code execution
- ✅ **Content Security Policy**: CSP headers
- ✅ **WAF**: Web Application Firewall

## Common Vulnerabilities

### Prevented

✅ **SQL Injection**: Using parameterized queries
✅ **XSS**: React auto-escaping + DOMPurify
✅ **CSRF**: Token-based auth (no cookies)
✅ **Clickjacking**: X-Frame-Options header
✅ **MITM**: HTTPS only

### Potential Risks

⚠️ **XSS in Dynamic Content**: Always sanitize user content
⚠️ **Token Theft**: Store tokens securely, use HTTPS
⚠️ **Brute Force**: Implement rate limiting
⚠️ **Session Fixation**: Regenerate tokens after auth

## Dependency Security

We use automated tools to scan dependencies:

### Tools Used

- **npm audit**: Check for known vulnerabilities
- **Dependabot**: Automatic dependency updates
- **Snyk**: Continuous security monitoring

### Updating Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Reporting Dependency Issues

If you find a vulnerable dependency:

1. Run `npm audit` to confirm
2. Check if fix is available
3. Create issue or pull request
4. Tag with `security` label

## Security Headers

We implement security headers via Cloudflare:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
```

## OAuth Security

### Google OAuth Configuration

- ✅ **Verified App**: App verified by Google
- ✅ **Minimal Scopes**: Only request needed permissions
- ✅ **Secure Redirect**: HTTPS redirect URIs only
- ✅ **State Parameter**: Prevent CSRF attacks
- ✅ **Token Validation**: Verify tokens server-side

### OAuth Best Practices

1. **Never share client secrets** in frontend code
2. **Use authorization code flow** (not implicit)
3. **Validate redirect URIs** strictly
4. **Regenerate tokens** after suspicious activity
5. **Revoke tokens** when user logs out

## Code Security

### Input Sanitization

```typescript
// Example: Sanitize domain input
function sanitizeDomain(domain: string): string {
  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');
  // Remove trailing slash
  domain = domain.replace(/\/$/, '');
  // Validate format
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(domain)) {
    throw new Error('Invalid domain format');
  }
  return domain;
}
```

### XSS Prevention

```typescript
// React auto-escapes by default
<div>{user.name}</div>  // Safe

// For HTML content, use DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />
```

### CSRF Prevention

```typescript
// Using JWT tokens in headers (not cookies) prevents CSRF
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Incident Response

If a security incident occurs:

### Immediate Actions

1. **Assess Impact**: Determine affected users/data
2. **Contain**: Disable affected features
3. **Notify**: Inform affected users
4. **Fix**: Deploy security patch
5. **Monitor**: Watch for further issues

### Post-Incident

1. **Root Cause Analysis**: Identify how it happened
2. **Prevention**: Implement measures to prevent recurrence
3. **Documentation**: Document incident and response
4. **Training**: Update team on lessons learned

## Security Checklist

For developers making changes:

- [ ] Sanitize all user inputs
- [ ] Escape all outputs
- [ ] Use parameterized queries
- [ ] Validate API responses
- [ ] Check authentication/authorization
- [ ] Update dependencies
- [ ] Review OWASP Top 10
- [ ] Test edge cases
- [ ] Run security scan
- [ ] Update documentation

## Contact

For security concerns:

- **Email**: security@reply.sh
- **GitHub Security Advisories**: [Create advisory](https://github.com/fauzi-rachman/reply-platform-dashboard/security/advisories/new)
- **Urgent Issues**: Create private issue, tag maintainers

## Hall of Fame

We recognize security researchers who help us:

<!-- 
Thank you to the following researchers:
- [Name] - [Vulnerability] - [Date]
-->

*No vulnerabilities reported yet.*

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Cloudflare Security](https://www.cloudflare.com/security/)

---

**Last Updated**: January 2024

Thank you for helping keep Reply Platform Dashboard secure! 🔒
