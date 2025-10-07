# Reply Platform Dashboard

A modern **Next.js dashboard** deployed to **Cloudflare Pages** with **Google OAuth** authentication and API integration.

> 📚 **Complete Documentation**: We've created comprehensive documentation to help you get started, contribute, and deploy. See the [Documentation](#-documentation) section below.

## 📋 Table of Contents

- [Live Dashboard](#-live-dashboard)
- [Features](#-features)
- [Dashboard Features](#-dashboard-features)
- [Quick Setup](#️-quick-setup)
- [Development](#-development)
- [Configuration](#-configuration)
- [Deployment](#-simple-deployment)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Related Projects](#️-related-projects)
- [Security](#️-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 **Live Dashboard**

**Production Dashboard**: `https://reply-platform-dashboard.pages.dev`

## ✨ **Features**

- 🔐 **Google OAuth** - Secure authentication with Google accounts
- 📱 **Responsive Design** - Mobile-friendly dashboard interface
- 🎨 **Tailwind CSS** - Modern styling and components
- ⚡ **Static Export** - Optimized for Cloudflare Pages deployment  
- 🔗 **API Integration** - Connects to Reply Platform API
- 📊 **Website Management** - Add and manage chatbot websites
- 📋 **Installation Snippets** - Copy-paste chatbot code
- 🛡️ **TypeScript** - Full type safety

## 📋 **Dashboard Features**

### Authentication
- **Google Sign-In** - One-click OAuth authentication
- **Email/Password** - Traditional login (if implemented)
- **JWT Tokens** - Secure session management

### Website Management
- **Add Websites** - Register new domains for chatbot
- **View Websites** - List all registered websites
- **Installation Code** - Generated snippets per website
- **Copy to Clipboard** - Easy code copying

## 🛠️ **Quick Setup**

### 1. Clone & Install
```bash
git clone https://github.com/fauzi-rachman/reply-platform-dashboard.git
cd reply-platform-dashboard
npm install
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_URL=https://reply-platform-api.red-frog-895a.workers.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_REDIRECT_URI=https://your-domain.pages.dev/auth/callback
```

### 3. Development Server
```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 4. Deploy to Cloudflare Pages
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

## 🔧 **Development**

```bash
# Start development server with hot reload
npm run dev

# Build for production (static export)
npm run build

# Start production server locally
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test
```

## 📚 **Configuration**

### Environment Variables

**Development** (`.env.local`):
- `NEXT_PUBLIC_API_URL` - API endpoint (localhost for development)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_REDIRECT_URI` - OAuth callback URL

**Production** (set in `wrangler.toml`):
- Automatically configured for Cloudflare Pages deployment
- Uses production API URL and proper redirect URIs

### API Integration

The dashboard connects to the Reply Platform API for:
- **Authentication** - Google OAuth token exchange
- **User Management** - Profile and session data  
- **Website CRUD** - Create, read, update, delete websites
- **Installation Codes** - Generate chatbot snippets

## 🚀 **Simple Deployment**

The repository is configured for **automatic deployment**:

1. **Fork this repository**
2. **Connect to Cloudflare Pages** in your dashboard
3. **Set build command**: `npm run build`
4. **Set output directory**: `out`
5. **Push to main branch** - Automatic deployment!

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy using wrangler  
npm run deploy

# Or deploy to Cloudflare Pages via dashboard upload
```

## 🔗 **Project Structure**

```
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── auth/callback/   # OAuth callback handler
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── login/           # Authentication page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page (redirect logic)
│   └── lib/
│       ├── api.ts           # API client and types
│       └── auth.ts          # Authentication utilities
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration  
├── wrangler.toml            # Cloudflare Pages configuration
└── package.json             # Dependencies and scripts
```

## 🔗 **Related Projects**

- **API Backend**: [reply-platform-api](https://github.com/fauzi-rachman/reply-platform-api)
- **Original Monorepo**: [reply-platform](https://github.com/fauzi-rachman/reply-platform)

## 🛡️ **Security**

Security is important to us. If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md).

**Key Security Features:**

- **OAuth 2.0** - Secure Google authentication flow
- **JWT Tokens** - Stateless authentication with 24-hour expiration
- **HTTPS Only** - All production traffic encrypted
- **CORS Configured** - Proper cross-origin policies
- **Input Validation** - All user inputs sanitized
- **Dependency Scanning** - Automated vulnerability checks

**Reporting**: Please email security concerns to security@reply.sh instead of opening public issues.

## 🤝 **Contributing**

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

**Quick Start for Contributors:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📖 **Documentation**

We provide comprehensive documentation to help you understand, use, and contribute to this project:

> 📑 **[Complete Documentation Index](DOCS_INDEX.md)** - Navigate all documentation by topic

### Core Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - System design, data flow, and technical decisions
- **[API Reference](API_REFERENCE.md)** - Complete API client documentation with examples
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment to Cloudflare Pages
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

### Contributing & Community

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines and standards
- **[Security Policy](SECURITY.md)** - Reporting vulnerabilities and security best practices

### Quick Links

- **Authentication Flow**: Google OAuth → JWT → API calls (see [Architecture](ARCHITECTURE.md))
- **Component Structure**: Detailed in [Architecture Guide](ARCHITECTURE.md)
- **API Integration**: Full reference in [API Reference](API_REFERENCE.md)
- **Common Issues**: Check [Troubleshooting Guide](TROUBLESHOOTING.md)

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.