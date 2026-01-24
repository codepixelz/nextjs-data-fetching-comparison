# Next.js Data Fetching Comparison

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square)](https://tanstack.com/query)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A comprehensive comparison application demonstrating **6 different data fetching approaches** in Next.js 16 with React 19, TanStack Query, and modern caching strategies.

> **[Live Demo](https://github.com/exx0dusss/nextjs-data-fetching-comparison)** · **[Documentation](/docs)** · **[Report Bug](https://github.com/exx0dusss/nextjs-data-fetching-comparison/issues)**

## 🚀 Features

- **6 Data Fetching Approaches**:
  1. Pure SPA (Client-Side with useEffect) ✅
  2. Hybrid SSR + Client (Server Components + Client Interactivity) ✅
  3. Pure SSR with Suspense (Full Server Rendering) ✅
  4. TanStack Query Client-Side ✅
  5. TanStack Query with Prefetching + Await ✅
  6. TanStack Query with Prefetching without Await ✅

- **React 19 Features**:
  - `use` hook demonstrations ✅
  - Server Components ✅
  - Suspense for data fetching ✅
  - React Compiler enabled ✅

- **Advanced Features**:
  - Server Actions with revalidateTag/revalidatePath ✅
  - Performance comparison dashboard (Coming Soon)
  - Web Vitals tracking (Coming Soon)
  - Cache hit/miss visualization (Coming Soon)

## 🛠️ Tech Stack

- **Next.js 16** - App Router with React 19
- **React 19** - Server Components, Suspense, use hook
- **TypeScript** - Strict mode enabled
- **TanStack Query v5** - Data synchronization and caching
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **React Compiler** - Automatic optimization

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Project Structure

```
nextjs-data-fetching-comparison/
├── app/
│   ├── api/                    # Internal API endpoints
│   │   ├── products/          # Product API with delays
│   │   ├── users/             # User API (fast)
│   │   ├── posts/             # Paginated posts API
│   │   └── metrics/           # Performance metrics storage
│   │
│   ├── approaches/             # Data fetching examples
│   │   ├── 1-spa-client-side/ # Pure SPA approach
│   │   ├── 2-hybrid-ssr-client/ # Hybrid SSR + Client
│   │   └── 3-pure-ssr/        # Pure SSR with Suspense
│   │
│   ├── use-hook-demo/         # React 19 use hook examples
│   └── server-actions-demo/   # Server Actions examples
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Layout components
│   └── shared/                 # Shared components
│
├── lib/
│   ├── query-client.ts        # TanStack Query configuration
│   ├── cache-config.ts        # Cache strategy constants
│   ├── mock-data.ts           # Mock API data
│   ├── api-client.ts          # Fetch utilities
│   └── performance.ts         # Performance tracking
│
├── hooks/
│   ├── use-products.ts        # TanStack Query hooks
│   ├── use-users.ts
│   └── use-posts.ts
│
├── types/
│   ├── api.ts                 # API type definitions
│   └── metrics.ts             # Metrics types
│
└── docs/                       # Documentation (Coming Soon)
    ├── CACHE_STRATEGY.md
    ├── APPROACH_COMPARISON.md
    ├── PERFORMANCE_GUIDE.md
    └── API_REFERENCE.md
```

## 🎯 Approach Overview

### 1. Pure SPA (Client-Side)
**Status**: ✅ Ready

Traditional React SPA with `useEffect` for data fetching.

**Pros**:
- Simple and familiar
- Full client-side control

**Cons**:
- No SEO
- Slower initial load
- Visible loading states

**Use Case**: Authenticated dashboards, admin panels

---

### 2. Hybrid SSR + Client
**Status**: ✅ Ready

Server Components for initial data + Client Components for interactivity.

**Pros**:
- SEO-friendly
- Fast TTFB
- Progressive enhancement

**Cons**:
- More complex
- Potential hydration issues

**Use Case**: E-commerce, news sites (70% SSR / 30% Client)

---

### 3. Pure SSR with Suspense
**Status**: ✅ Ready

Full server-side rendering with React Suspense streaming.

**Pros**:
- Excellent SEO
- Fast FCP with streaming
- Server-side caching

**Cons**:
- Limited client interactivity
- Cache invalidation complexity

**Use Case**: Blogs, documentation (95% SSR / 5% Client)

---

### 4-6. TanStack Query Approaches
**Status**: ✅ Ready

Client-side and SSR prefetching patterns with TanStack Query, demonstrating intelligent caching and different prefetching strategies.

## 🎓 Key Learnings

### Caching Strategy

**CRITICAL**: When using TanStack Query with Next.js SSR:

```typescript
// ❌ DON'T: Mix both caches
fetch(url, { next: { revalidate: 60 } })  // Next.js cache
useQuery({ staleTime: 60000 })             // TanStack cache

// ✅ DO: Pick one cache layer
fetch(url, { cache: 'no-store' })          // Disable Next.js cache
useQuery({ staleTime: 60000 })             // Use TanStack cache
```

**Why?** Mixing both caches can cause:
- Stale data issues
- Complex cache invalidation
- Unpredictable behavior

### When to Use Each Approach

```
Do you need SEO?
├─ No → TanStack Query client-side (Approach 4)
└─ Yes
   ├─ Need heavy interactivity?
   │  ├─ Yes → TanStack Prefetch (Approaches 5-6)
   │  └─ No → Pure SSR (Approach 3)
   └─ Need real-time updates?
      ├─ Yes → Hybrid (Approach 2)
      └─ No → Pure SSR (Approach 3)
```

## 🔍 API Endpoints

All endpoints support configurable delays for testing:

```bash
# Products API (slow: 500ms default)
GET /api/products?delay=1000&limit=10&offset=0
GET /api/products/:id

# Users API (fast: 50ms default)
GET /api/users?delay=200
GET /api/users/:id

# Posts API (medium: 400ms default)
GET /api/posts?page=1&limit=10
GET /api/posts/:id
GET /api/posts/:id/comments

# Metrics API
POST /api/metrics
GET /api/metrics?approach=spa-client&metric=LOAD_TIME
```

## 📊 Performance Metrics

Performance tracking includes:
- **TTFB** (Time to First Byte)
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **TTI** (Time to Interactive)

## 🚧 Features & Progress

- [x] Implement Approach 4: TanStack Query Client
- [x] Implement Approach 5: TanStack Prefetch with Await
- [x] Implement Approach 6: TanStack Prefetch without Await
- [x] React 19 `use` hook examples
- [x] Server Actions with revalidation
- [x] Real-time performance metrics (Web Vitals)
- [x] Comprehensive documentation & guides
- [x] SEO & crawler capabilities guide
- [x] Decision tree for approach selection
- [ ] Cache visualization tools
- [ ] Comparison dashboard with charts

## 💡 Recommendations

### Hybrid Architecture Ratios

**70% SSR / 30% Client**:
- E-commerce product pages
- News/blog sites
- Marketing pages with forms

**95% SSR / 5% Client**:
- Documentation sites
- Content-heavy blogs
- Public-facing pages

**5% SSR / 95% Client**:
- Dashboards
- Admin panels
- Internal tools

### Should You Combine Next.js Cache with TanStack?

**Generally NO** for simplicity.

**YES only if**:
- You understand both systems deeply
- You have different revalidation needs per layer
- You're willing to manage complexity

**Recommendation**: Pick one cache layer per approach.

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more approaches
- Improve documentation
- Add performance tests
- Enhance visualizations

## 📝 License

MIT

## 🙏 Acknowledgments

- Next.js team for amazing framework features
- TanStack team for React Query
- shadcn for beautiful UI components
- Vercel for deployment platform

---

Built with ❤️ using Next.js 16, React 19, and TanStack Query

⭐ **Star this repo** if you find it helpful!
