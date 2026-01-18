# Visual Life Execution System - Frontend

A Next.js 15 application that transforms human effort into evolving visual art. Users create multi-domain life visions that progressively colorize from grayscale through real action.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 LTS or higher
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Create `.env.local` file (or use the defaults - mock mode is ENABLED by default):
   ```env
   # Mock data mode is ENABLED by default (no backend required)
   # Set NEXT_PUBLIC_USE_MOCK_DATA=false to use real backend
   NEXT_PUBLIC_USE_MOCK_DATA=true
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   NEXT_PUBLIC_CDN_URL=http://localhost:9000
   NEXT_PUBLIC_ENV=development
   ```
   
   **Note:** If `.env.local` doesn't exist, the app defaults to **mock data mode** (no backend needed).

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication (Development Mode)

### Sign In / Sign Up

Since the application is currently configured to use **mock data mode** (no backend required), you can sign in or sign up with:

- **Any valid email address** (e.g., `test@example.com`)
- **Any password** with at least 8 characters (e.g., `password123`)

**Quick Start:**
1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter any email: `demo@example.com`
3. Enter any password (8+ characters): `password123`
4. Click "Sign in" or use the "create a new account" link

**Alternative:** Use the landing page and click "Get Started" to create an account.

**Note:** In mock data mode, authentication is simulated - no actual backend validation occurs. All emails/passwords are accepted as long as they meet the format requirements.

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes (login, signup)
│   ├── (protected)/         # Protected routes (dashboard, domains, etc.)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── domains/            # Domain management components
│   ├── boards/             # Vision board components
│   ├── journal/            # Journal entry components
│   ├── timeline/           # Timeline and journey view
│   ├── layout/             # Layout components (Navbar, etc.)
│   └── shared/             # Shared UI components (Button, Input, Modal)
├── lib/
│   ├── api/                # API client and endpoints
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state stores
│   ├── query/              # React Query configuration
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── public/                 # Static assets
```

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS
- **State Management:** Zustand + React Query
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Key Features

- ✅ Authentication (Login, Signup, Protected Routes)
- ✅ Domain Management (Create, Edit, Delete, Image Upload)
- ✅ Vision Board Display
- ✅ Dashboard with Progress Overview
- ✅ Responsive Design
- ✅ Mock Data Support (Development without backend)

## 🎯 Core Flows

### 1. Authentication Flow
- `/login` - User login
- `/signup` - User registration
- Protected routes require authentication
- JWT token management with refresh

### 2. Domain Management
- `/domains` - View all domains
- Create/Edit domains with images
- Color-coded domain visualization

### 3. Dashboard
- `/dashboard` - Main dashboard
- Vision board display
- Quick stats and actions

## 🔧 Development

### Mock Data Mode

The application supports mock data mode when the backend is not available. Set `NEXT_PUBLIC_ENV=development` and ensure `NEXT_PUBLIC_API_BASE_URL` doesn't point to a real backend to use mock data.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📝 API Integration

The frontend communicates with the backend via REST API. All API calls are defined in `lib/api/` with:
- Type-safe request/response types
- Automatic token refresh
- Error handling
- Mock data fallback

See `frotend.md` for complete API contract documentation.

## 🎨 Styling

This project uses Tailwind CSS for styling. Components follow a consistent design system:
- Shared components in `components/shared/`
- Responsive breakpoints: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)

## 🚧 In Progress

The following features are being implemented:
- [ ] Goal Management (Create, Decompose, Track)
- [ ] Daily Journal Entry
- [ ] Task Validation (Morning)
- [ ] Timeline View (Weekly Wraps)
- [ ] Settings & Preferences

## 📚 Documentation

For complete frontend development guide, see:
- `/frotend.md` - Complete frontend developer guide
- `/idea.md` - Full system architecture and user flows

## 🤝 Contributing

1. Create a feature branch
2. Implement your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the Visual Life Execution System.