# Architecture Documentation

This document provides a comprehensive overview of the Reply Platform Dashboard architecture, design decisions, and technical implementation.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Authentication Architecture](#authentication-architecture)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Deployment Architecture](#deployment-architecture)
- [Design Decisions](#design-decisions)

## System Overview

The Reply Platform Dashboard is a **static Next.js application** deployed on **Cloudflare Pages**. It serves as the management interface for the Reply Platform chatbot system, allowing users to:

- Authenticate via Google OAuth
- Manage website integrations
- Generate and copy chatbot installation snippets
- View and manage their chatbot deployments

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │     Next.js Static Application (React)          │    │
│  │                                                  │    │
│  │  - React Components                             │    │
│  │  - Client-side Routing                          │    │
│  │  - Local State Management                       │    │
│  │  - API Client                                   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Cloudflare Pages (CDN)                      │
│                                                          │
│  - Static File Hosting                                  │
│  - Global CDN Distribution                              │
│  - HTTPS/SSL                                            │
└─────────────────────────────────────────────────────────┘
                         │
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│        Reply Platform API (Cloudflare Workers)           │
│                                                          │
│  - Google OAuth Integration                             │
│  - JWT Authentication                                   │
│  - Website Management                                   │
│  - User Management                                      │
└─────────────────────────────────────────────────────────┘
                         │
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Cloudflare D1 Database                      │
│                                                          │
│  - User Data                                            │
│  - Website Records                                      │
│  - Session Data                                         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js built-in bundler

### Infrastructure

- **Hosting**: Cloudflare Pages
- **CDN**: Cloudflare Global Network
- **SSL/TLS**: Automatic via Cloudflare

### Development Tools

- **Type Checking**: TypeScript 5.3
- **Linting**: ESLint (Next.js config)
- **Testing**: Jest + React Testing Library
- **Package Manager**: npm

## Project Structure

```
reply-platform-dashboard/
│
├── src/                          # Source code
│   ├── app/                      # Next.js App Router
│   │   ├── auth/                 # Authentication pages
│   │   │   └── callback/         # OAuth callback handler
│   │   │       └── page.tsx      # Processes OAuth response
│   │   ├── dashboard/            # Main dashboard
│   │   │   └── page.tsx          # Dashboard UI and logic
│   │   ├── login/                # Login page
│   │   │   └── page.tsx          # Authentication entry point
│   │   ├── globals.css           # Global styles + Tailwind
│   │   ├── layout.tsx            # Root layout component
│   │   └── page.tsx              # Home page (redirect logic)
│   │
│   └── lib/                      # Shared utilities
│       ├── api.ts                # API client and types
│       └── auth.ts               # Auth helpers (localStorage)
│
├── public/                       # Static assets
│   └── reply-sh-logo-wide.png    # Logo image
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── CONTRIBUTING.md           # Contribution guide
│   └── API_REFERENCE.md          # API documentation
│
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── wrangler.toml                 # Cloudflare Pages config
├── package.json                  # Dependencies and scripts
└── .env.example                  # Environment variables template
```

### Directory Responsibilities

#### `src/app/`
Next.js 13+ App Router directory. Each folder represents a route:
- File-based routing
- Server and client components
- Layout composition

#### `src/lib/`
Shared utilities and helpers:
- **`api.ts`**: Centralized API client, type definitions
- **`auth.ts`**: Authentication utilities (token management)

#### `public/`
Static assets served directly:
- Images, fonts, static files
- Accessible at root URL path

## Core Components

### 1. Authentication Pages

#### Login Page (`src/app/login/page.tsx`)

**Responsibilities:**
- Display login interface
- Handle Google OAuth initiation
- Handle email/password login (optional)
- Redirect authenticated users to dashboard

**Key Features:**
```typescript
// Google OAuth URL construction
const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
googleAuthUrl.searchParams.append('client_id', clientId);
googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
googleAuthUrl.searchParams.append('response_type', 'code');
googleAuthUrl.searchParams.append('scope', 'email profile');
```

#### OAuth Callback (`src/app/auth/callback/page.tsx`)

**Responsibilities:**
- Process OAuth authorization code
- Exchange code for JWT token
- Store authentication token
- Redirect to dashboard

**Flow:**
1. Receive OAuth code from Google
2. Send code to API backend
3. Receive JWT token
4. Store token in localStorage
5. Redirect to dashboard

### 2. Dashboard Page (`src/app/dashboard/page.tsx`)

**Responsibilities:**
- Display user information
- List user's websites
- Add new websites
- Generate installation snippets
- Copy snippets to clipboard
- Handle logout

**State Management:**
```typescript
const [user, setUser] = useState<User | null>(null);
const [websites, setWebsites] = useState<Website[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 3. API Client (`src/lib/api.ts`)

**Responsibilities:**
- Centralized API communication
- Type-safe request/response handling
- Error handling
- Authentication header management

**Key Methods:**
- `auth()`: Google OAuth code exchange
- `login()`: Email/password authentication
- `requestOTP()`: Request OTP code via email
- `verifyOTP()`: Verify OTP and authenticate
- `getMe()`: Fetch current user data
- `getWebsites()`: Fetch user's websites
- `addWebsite()`: Add new website
- `deleteWebsite()`: Remove website

### 4. Auth Utilities (`src/lib/auth.ts`)

**Responsibilities:**
- Token storage (localStorage)
- Token retrieval
- Authentication state checking

**Implementation:**
```typescript
export const auth = {
  setToken(token: string): void
  getToken(): string | null
  removeToken(): void
  isAuthenticated(): boolean
}
```

## Data Flow

### Authentication Flow

#### Google OAuth Flow
```
1. User clicks "Sign in with Google"
   │
   ├─→ Redirect to Google OAuth
   │
2. User grants permissions
   │
   ├─→ Google redirects to /auth/callback?code=xxx
   │
3. Callback page receives code
   │
   ├─→ POST /auth/google { code, redirectUri }
   │
4. API validates code with Google
   │
   ├─→ Returns JWT token
   │
5. Store token in localStorage
   │
   └─→ Redirect to /dashboard
```

#### Email/Password Flow
```
1. User enters email and password
   │
   ├─→ POST /auth/login { email, password }
   │
2. API validates credentials
   │
   ├─→ Returns JWT token
   │
3. Store token in localStorage
   │
   └─→ Redirect to /dashboard
```

#### Email OTP Flow (Passwordless)
```
1. User clicks "Use OTP instead"
   │
2. User enters email
   │
   ├─→ POST /auth/otp/request { email }
   │
3. API sends OTP code to email
   │
4. User enters 6-digit OTP code
   │
   ├─→ POST /auth/otp/verify { email, otp }
   │
5. API validates OTP
   │
   ├─→ Returns JWT token
   │
6. Store token in localStorage
   │
   └─→ Redirect to /dashboard
```

### Website Management Flow

```
Dashboard Load:
1. Read token from localStorage
2. GET /auth/me → User data
3. GET /websites → User's websites
4. Display in UI

Add Website:
1. User enters domain
2. POST /websites { domain }
3. Add new website to local state
4. Display in list

Delete Website:
1. User clicks delete
2. DELETE /websites/:id
3. Remove from local state
4. Update UI
```

### Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│ (React App) │
└──────┬──────┘
       │
       │ 1. User Action
       ▼
┌─────────────┐
│ Component   │
│   State     │
└──────┬──────┘
       │
       │ 2. API Call
       ▼
┌─────────────┐
│  API Client │
│  (api.ts)   │
└──────┬──────┘
       │
       │ 3. HTTP Request
       ▼
┌─────────────┐
│ Reply API   │
│ (Backend)   │
└──────┬──────┘
       │
       │ 4. Response
       ▼
┌─────────────┐
│ Component   │
│   Update    │
└─────────────┘
```

## Authentication Architecture

### Token-Based Authentication

The application uses **JWT (JSON Web Tokens)** for stateless authentication:

1. **Token Acquisition**: User authenticates via Google OAuth, email/password, or email OTP
2. **Token Storage**: JWT stored in browser localStorage
3. **Token Usage**: Included in `Authorization` header for API requests
4. **Token Validation**: API validates token on each request

### Authentication Methods

The platform supports three authentication methods:

1. **Google OAuth**: Industry-standard OAuth 2.0 flow
2. **Email/Password**: Traditional credentials-based login
3. **Email OTP**: Passwordless login with one-time codes sent via email

### Security Considerations

- **HTTPS Only**: All production traffic encrypted
- **OAuth 2.0**: Industry-standard authentication
- **JWT Expiration**: Tokens have limited lifetime
- **No Sensitive Data**: Tokens stored client-side only
- **CORS**: Proper cross-origin policies configured
- **OTP Expiration**: One-time codes expire after a short period
- **Rate Limiting**: OTP requests are rate-limited to prevent abuse

## API Integration

### API Client Design

The API client (`src/lib/api.ts`) provides:

1. **Type Safety**: TypeScript interfaces for all API responses
2. **Centralization**: Single source of truth for API calls
3. **Error Handling**: Consistent error handling across app
4. **Token Management**: Automatic inclusion of auth tokens

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/google` | Exchange OAuth code for JWT | No |
| POST | `/auth/login` | Email/password login | No |
| POST | `/auth/otp/request` | Request OTP code via email | No |
| POST | `/auth/otp/verify` | Verify OTP and authenticate | No |
| GET | `/auth/me` | Get current user info | Yes |
| GET | `/websites` | List user's websites | Yes |
| POST | `/websites` | Add new website | Yes |
| DELETE | `/websites/:id` | Delete website | Yes |

### Request/Response Types

```typescript
// Request Types
interface GoogleAuthRequest {
  code: string;
  redirectUri: string;
}

interface AddWebsiteRequest {
  domain: string;
}

// Response Types
interface AuthResponse {
  token: string;
  user: User;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

interface Website {
  id: string;
  user_id: string;
  domain: string;
  created_at: string;
  updated_at: string;
}
```

## State Management

### Local Component State

The application uses **React hooks** for state management:

- **`useState`**: Local component state
- **`useEffect`**: Side effects (API calls, redirects)
- **`useRouter`**: Next.js navigation
- **`useSearchParams`**: URL parameters

### No Global State Library

Decision: **No Redux, Zustand, or other global state**

**Rationale:**
- Simple application scope
- Most state is page-specific
- Authentication via localStorage
- Reduces bundle size
- Easier to maintain

### State Locations

1. **localStorage**: Authentication token
2. **Component State**: UI state, form data, API responses
3. **URL Parameters**: OAuth callback data

## Deployment Architecture

### Build Process

```bash
npm run build → next build (static export)
```

1. **TypeScript Compilation**: TSC compiles .tsx to .js
2. **React Rendering**: Components pre-rendered to HTML
3. **Asset Optimization**: Images, CSS optimized
4. **Static Export**: Generates `/out` directory

### Output Structure

```
out/
├── index.html              # Home page
├── login/
│   └── index.html         # Login page
├── auth/
│   └── callback/
│       └── index.html     # OAuth callback
├── dashboard/
│   └── index.html         # Dashboard
├── _next/                 # Next.js assets
│   ├── static/            # Static chunks
│   └── ...
└── ...
```

### Cloudflare Pages Deployment

1. **Push to GitHub**: Code pushed to main branch
2. **Auto-Build**: Cloudflare runs `npm run build`
3. **Deploy**: Static files from `/out` deployed to CDN
4. **DNS**: Custom domain configured (reply-platform-dashboard.pages.dev)

### Environment Variables

**Build-time** (set in Cloudflare dashboard):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_REDIRECT_URI`

**Runtime**: None needed (static export)

## Design Decisions

### 1. Static Export vs. Server-Side Rendering

**Decision**: Use static export (`output: 'export'`)

**Rationale:**
- Cloudflare Pages is optimized for static sites
- No server-side logic needed
- Better performance (CDN caching)
- Lower cost (no compute)
- Simpler deployment

**Trade-offs:**
- No server-side rendering
- No API routes (use external API)
- No dynamic routes with parameters

### 2. Client-Side Authentication

**Decision**: Store JWT in localStorage

**Rationale:**
- Static export doesn't support server sessions
- Simple implementation
- Works with static hosting
- Common pattern for SPAs

**Trade-offs:**
- Token accessible to JavaScript (XSS risk)
- Mitigated by HTTPS and proper input sanitization

### 3. Next.js App Router

**Decision**: Use Next.js 13+ App Router

**Rationale:**
- Modern Next.js architecture
- Better file-based routing
- Server/client component flexibility
- Future-proof

### 4. Tailwind CSS

**Decision**: Use Tailwind for styling

**Rationale:**
- Rapid development
- Consistent design system
- Small bundle size (purged)
- No CSS-in-JS runtime overhead

### 5. TypeScript

**Decision**: Full TypeScript adoption

**Rationale:**
- Type safety
- Better IDE support
- Catch errors at compile time
- Self-documenting code

### 6. Minimal Dependencies

**Decision**: Keep dependencies minimal

**Rationale:**
- Smaller bundle size
- Fewer security vulnerabilities
- Easier maintenance
- Faster builds

**Current dependencies:**
- React, Next.js (core)
- Tailwind CSS (styling)
- TypeScript (types)

## Performance Considerations

### Bundle Size Optimization

- **Static export**: No runtime server code
- **Tailwind purge**: Unused CSS removed
- **Image optimization**: `unoptimized: true` for static export
- **Code splitting**: Next.js automatic splitting

### Loading Performance

- **CDN**: Cloudflare global network
- **Caching**: Aggressive CDN caching
- **Prerendering**: All pages pre-rendered

### Runtime Performance

- **Client-side routing**: No full page reloads
- **Lazy loading**: Components loaded on demand
- **Minimal JavaScript**: Only essential client code

## Future Considerations

### Potential Enhancements

1. **Server-Side Rendering**: Move to Cloudflare Workers for SSR
2. **API Routes**: Add Next.js API routes via Workers
3. **Real-time Updates**: WebSocket for live data
4. **Advanced State**: Add Zustand/Redux if complexity grows
5. **PWA**: Progressive Web App capabilities
6. **Analytics**: User behavior tracking

### Scalability

Current architecture supports:
- **Users**: Unlimited (static CDN)
- **Traffic**: Scales with Cloudflare
- **Data**: Limited by API backend

For higher scale, consider:
- API rate limiting
- Caching strategies
- Database optimization

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
