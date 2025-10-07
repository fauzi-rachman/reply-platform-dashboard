# Contributing to Reply Platform Dashboard

Thank you for your interest in contributing to the Reply Platform Dashboard! This guide will help you get started with development and contribution.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/reply-platform-dashboard.git
   cd reply-platform-dashboard
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/fauzi-rachman/reply-platform-dashboard.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8787
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Branching Strategy

We follow a simple branching model:

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a New Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** in small, focused commits
2. **Test your changes** thoroughly
3. **Run linting and type checking**:
   ```bash
   npm run lint
   npm run type-check
   ```

4. **Build the project** to ensure it compiles:
   ```bash
   npm run build
   ```

### Commit Messages

Write clear, descriptive commit messages following this format:

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add website deletion functionality

fix: resolve OAuth callback error handling

docs: update API integration guide
```

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Define proper types** - avoid `any` when possible
- **Use interfaces** for object shapes
- **Export types** that are used across files

Example:
```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string | null;
}

// Avoid
const user: any = { ... };
```

### React Components

- **Use functional components** with hooks
- **Use TypeScript** for props
- **Follow single responsibility** principle
- **Extract reusable logic** into custom hooks

Example:
```tsx
interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  // Component implementation
}
```

### Styling

- **Use Tailwind CSS** for styling
- **Use utility classes** from globals.css (`.btn`, `.card`, `.input`)
- **Keep styles consistent** with existing components
- **Use responsive design** classes (`sm:`, `md:`, `lg:`)

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Login page
├── lib/                   # Shared utilities
│   ├── api.ts            # API client
│   └── auth.ts           # Auth utilities
└── components/           # Reusable components (if needed)
```

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- **Write tests** for new features and bug fixes
- **Follow existing test patterns** in the codebase
- **Test edge cases** and error handling
- **Mock external dependencies** (API calls, etc.)

Example:
```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from './page';

describe('Dashboard', () => {
  it('renders dashboard heading', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

### Test Coverage

- Aim for **80%+ code coverage** for new code
- All **critical paths** should be tested
- **API integrations** should have comprehensive tests

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**:
   ```bash
   npm test
   ```

2. **Run linting**:
   ```bash
   npm run lint
   ```

3. **Run type checking**:
   ```bash
   npm run type-check
   ```

4. **Build successfully**:
   ```bash
   npm run build
   ```

5. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue number (if applicable)
   - Screenshots (for UI changes)
   - Testing performed

4. **Request review** from maintainers

### PR Review Process

- Maintainers will review your PR within **3-5 business days**
- Address any **requested changes**
- Keep your PR **up to date** with main branch
- Once approved, maintainers will **merge** your PR

### After Your PR is Merged

1. **Delete your feature branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your local main**:
   ```bash
   git checkout main
   git pull upstream main
   ```

## Project Structure

For detailed information about the project architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

### Key Directories

- **`src/app/`** - Next.js 13+ App Router pages
- **`src/lib/`** - Shared utilities and helpers
- **`public/`** - Static assets (images, fonts, etc.)
- **`docs/`** - Additional documentation

### Key Files

- **`src/lib/api.ts`** - API client and type definitions
- **`src/lib/auth.ts`** - Authentication utilities
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`wrangler.toml`** - Cloudflare Pages configuration

## Getting Help

- **Documentation**: Check our [docs](README.md) first
- **Issues**: Search [existing issues](https://github.com/fauzi-rachman/reply-platform-dashboard/issues)
- **New Issue**: [Create a new issue](https://github.com/fauzi-rachman/reply-platform-dashboard/issues/new) with details

## Questions?

If you have questions about contributing, feel free to:
- Open a [GitHub Discussion](https://github.com/fauzi-rachman/reply-platform-dashboard/discussions)
- Check existing [documentation](README.md)
- Ask in a relevant issue

Thank you for contributing! 🎉
