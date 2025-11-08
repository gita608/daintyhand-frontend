# Crafty Whimsy Creations - Project Guide

> **Quick Reference Guide for AI Assistants and Developers**

## 📋 Project Overview

**Project Name:** Crafty Whimsy Creations (Brand: "DaintyHand")  
**Type:** E-commerce Website for Handmade Crafts  
**Stack:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**State Management:** LocalStorage (Cart & Wishlist) + React Query for data fetching  
**Routing:** React Router v6

### What This Project Does
An e-commerce website selling handmade craft items including:
- Wedding invitations
- Pressed flower art
- Custom cards
- Scrapbooks
- Wall art
- Journals
- Gift boxes
- Decorative items

---

## 🗂️ Project Structure

```
crafty-whimsy-creations-main/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components (buttons, cards, etc.)
│   │   ├── Header.tsx       # Navigation header with cart/wishlist links
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Hero.tsx         # Homepage hero section
│   │   ├── Categories.tsx   # Category filter/display
│   │   ├── Products.tsx     # Product grid display
│   │   ├── ProductCarousel.tsx  # Featured products carousel
│   │   ├── Testimonials.tsx # Customer testimonials
│   │   ├── Contact.tsx      # Contact form/section
│   │   └── ScrollToTop.tsx  # Scroll to top utility
│   │
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Homepage (main landing page)
│   │   ├── AllProducts.tsx  # All products listing page
│   │   ├── ProductDetail.tsx # Individual product detail page
│   │   ├── Cart.tsx         # Shopping cart page
│   │   ├── Wishlist.tsx     # Wishlist page
│   │   └── NotFound.tsx     # 404 error page
│   │
│   ├── data/
│   │   └── products.ts      # Product data (12 products + categories)
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   └── use-toast.ts     # Toast notification hook
│   │
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn helper, etc.)
│   │
│   ├── App.tsx              # Main app component (routing setup)
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles + CSS variables
│
├── public/                  # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── package.json             # Dependencies & scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🎯 Key Features & Functionality

### 1. **Product Management**
- **Location:** `src/data/products.ts`
- 12 predefined products with categories
- Categories: Invitations, Wall Art, Paper Crafts, Albums, Cards, Decorations, Journals, Gift Wrap, Frames
- Product structure: `id`, `title`, `description`, `price`, `image`, `category`, `rating`, `reviews`

### 2. **Shopping Cart**
- **Location:** `src/pages/Cart.tsx`
- **Storage:** LocalStorage (`localStorage.getItem('cart')`)
- Features:
  - Add/remove items
  - Update quantities
  - Calculate totals
  - Persistent across sessions

### 3. **Wishlist**
- **Location:** `src/pages/Wishlist.tsx`
- **Storage:** LocalStorage (`localStorage.getItem('wishlist')`)
- Features:
  - Save/remove items
  - Add to cart from wishlist
  - Persistent across sessions

### 4. **Routing**
- **Location:** `src/App.tsx`
- Routes:
  - `/` → Homepage (Index)
  - `/products` → All products page
  - `/product/:id` → Product detail page
  - `/cart` → Shopping cart
  - `/wishlist` → Wishlist
  - `*` → 404 Not Found

---

## 🎨 Styling & Design System

### Theme Colors (Custom)
Located in `tailwind.config.ts` and `src/index.css`:
- `dainty-pink` - Primary brand color
- `dainty-blue` - Secondary brand color
- `dainty-cream` - Background accent
- `dainty-gray` - Text color
- `dainty-lavender` - Accent color

### Typography
- **Primary Font:** Playfair Display (serif) - for headings
- **Body Font:** Inter (sans-serif) - for body text

### UI Components
- **Library:** shadcn/ui (Radix UI primitives)
- **Location:** `src/components/ui/`
- All standard components available (button, card, dialog, toast, etc.)

---

## 🔧 Technology Stack

### Core
- **React 18.3.1** - UI framework
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.1** - Build tool & dev server

### UI Libraries
- **shadcn/ui** - Component library (Radix UI based)
- **Tailwind CSS 3.4.11** - Utility-first CSS
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel component

### State & Data
- **React Query (@tanstack/react-query)** - Server state management
- **React Router DOM 6.26.2** - Client-side routing
- **LocalStorage** - Client-side persistence (cart/wishlist)

### Forms & Validation
- **React Hook Form 7.53.0** - Form handling
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Form validation integration

---

## 📍 Where to Find Things

### Adding a New Product
→ Edit `src/data/products.ts` - Add to the `products` array

### Modifying Navigation
→ Edit `src/components/Header.tsx` - Header component with nav links

### Changing Routes
→ Edit `src/App.tsx` - Route definitions

### Styling Changes
→ Edit `tailwind.config.ts` for theme colors  
→ Edit `src/index.css` for CSS variables and global styles

### Cart/Wishlist Logic
→ `src/pages/Cart.tsx` - Cart functionality  
→ `src/pages/Wishlist.tsx` - Wishlist functionality  
→ Both use LocalStorage for persistence

### Product Display Components
→ `src/components/Products.tsx` - Product grid  
→ `src/components/ProductCarousel.tsx` - Featured carousel  
→ `src/pages/ProductDetail.tsx` - Individual product page

### Homepage Sections
→ `src/pages/Index.tsx` - Composes all homepage sections:
  - Hero
  - Categories
  - ProductCarousel
  - Products
  - Testimonials
  - Contact
  - Footer

---

## 🚀 Development Commands

```bash
npm run dev      # Start development server (port 8080)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Server
- **Port:** 8080 (configured in `vite.config.ts`)
- **Host:** `::` (all interfaces)
- **Auto-reload:** Enabled via Vite HMR

---

## 💾 Data Storage

### LocalStorage Keys
- `cart` - Shopping cart items (array)
- `wishlist` - Wishlist items (array)

### Data Structure

**Cart Item:**
```typescript
{
  id: string;           // Unique cart item ID
  product_id: number;   // Product ID from products.ts
  title: string;
  price: string;        // Format: "₹10,000"
  image: string;
  description: string;
  quantity: number;
}
```

**Wishlist Item:**
```typescript
{
  id: string;           // Unique wishlist item ID
  product_id: number;   // Product ID from products.ts
  title: string;
  price: string;
  image: string;
  description: string;
}
```

---

## 🎯 Common Tasks & Quick Fixes

### Add a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Header.tsx` (if needed)

### Add a New Product Category
1. Add category name to `categories` array in `src/data/products.ts`
2. Update category filter in `src/components/Categories.tsx` (if needed)

### Modify Product Data Structure
1. Update `products` array type in `src/data/products.ts`
2. Update all components that use products:
   - `src/components/Products.tsx`
   - `src/pages/ProductDetail.tsx`
   - `src/pages/Cart.tsx`
   - `src/pages/Wishlist.tsx`

### Change Theme Colors
1. Update CSS variables in `src/index.css`
2. Update Tailwind config in `tailwind.config.ts` (if adding new colors)

### Add New UI Component
- Use shadcn/ui CLI: `npx shadcn-ui@latest add [component]`
- Or manually add to `src/components/ui/`

---

## 🔍 Important Files to Check First

When debugging or making changes, check these files in order:

1. **Routing Issues** → `src/App.tsx`
2. **Product Data** → `src/data/products.ts`
3. **Styling Issues** → `src/index.css` + `tailwind.config.ts`
4. **Cart/Wishlist** → `src/pages/Cart.tsx` / `src/pages/Wishlist.tsx`
5. **Component Issues** → `src/components/[ComponentName].tsx`
6. **Build Config** → `vite.config.ts`
7. **Type Errors** → `tsconfig.json`

---

## 📦 Key Dependencies

### Production
- React ecosystem (react, react-dom, react-router-dom)
- UI libraries (Radix UI components via shadcn/ui)
- Styling (Tailwind CSS, tailwindcss-animate)
- Icons (lucide-react)
- Forms (react-hook-form, zod)
- State (@tanstack/react-query)

### Development
- Vite + React SWC plugin
- TypeScript
- ESLint
- PostCSS + Autoprefixer

---

## 🎨 Design Patterns Used

1. **Component Composition** - Pages composed of smaller components
2. **LocalStorage Persistence** - Cart and wishlist persist in browser
3. **React Query** - For potential API integration (currently using static data)
4. **Custom Hooks** - `use-toast`, `use-mobile` for reusable logic
5. **Path Aliases** - `@/` maps to `src/` (configured in `vite.config.ts`)

---

## ⚠️ Important Notes

- **No Backend API** - All data is static in `src/data/products.ts`
- **No Authentication** - No user accounts or login system
- **LocalStorage Only** - Cart/wishlist data is browser-specific
- **Currency:** Indian Rupees (₹) - hardcoded in product prices
- **Images:** Using Unsplash URLs - consider hosting locally for production

---

## 🔄 Future Enhancement Areas

1. **Backend Integration** - Replace static data with API calls
2. **User Authentication** - Add login/signup functionality
3. **Payment Integration** - Add checkout/payment processing
4. **Product Search** - Add search functionality
5. **Product Reviews** - User-generated reviews
6. **Order Management** - Order history and tracking
7. **Image Optimization** - Local image hosting and optimization

---

## 📝 Quick Reference: File Purposes

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, routing setup, providers |
| `src/main.tsx` | React entry point |
| `src/data/products.ts` | **ALL PRODUCT DATA** - single source of truth |
| `src/pages/Index.tsx` | Homepage composition |
| `src/components/Header.tsx` | Navigation & cart/wishlist links |
| `src/pages/Cart.tsx` | Shopping cart logic & UI |
| `src/pages/Wishlist.tsx` | Wishlist logic & UI |
| `vite.config.ts` | Build tool configuration |
| `tailwind.config.ts` | Theme & styling configuration |
| `src/index.css` | Global styles & CSS variables |

---

**Last Updated:** Project exploration completed  
**Purpose:** Quick reference for AI assistants to understand project structure and reduce processing time

