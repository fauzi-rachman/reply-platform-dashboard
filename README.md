# Reply Platform Dashboard

A modern **Next.js dashboard** deployed to **Cloudflare Pages** with **Google OAuth** authentication and API integration.

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

- **OAuth 2.0** - Secure Google authentication flow
- **JWT Tokens** - Stateless authentication
- **HTTPS Only** - All production traffic encrypted
- **CORS Configured** - Proper cross-origin policies

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📖 **Documentation**

- **Authentication Flow**: Google OAuth → JWT → API calls
- **Component Structure**: See inline JSDoc comments
- **API Integration**: Check `src/lib/api.ts`

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.