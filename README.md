# Super Admin Dashboard

A modern super admin dashboard built with Next.js 15, TypeScript, and shadcn/ui components.

## Features

- **Responsive Sidebar Navigation** with mobile support
- **Dashboard Home Page** with overview cards and recent activity
- **Settings Page** with company management table
- **Contacts Page** (placeholder)
- **Status Page** with system monitoring cards
- **Modern UI** using shadcn/ui components and Tailwind CSS

## Navigation

The sidebar includes the following sections:
- **Home** - Dashboard overview with statistics and recent activity
- **Settings** - Company management with detailed table showing:
  - Company ID (UUID)
  - Company Name
  - Company Logo
  - Company Address (JSONB)
  - Contacts (JSONB)
  - Social Media Links (JSONB)
- **Contacts** - Contact management (placeholder)
- **Status** - System status monitoring

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible component primitives

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Setup

This project uses Supabase for data. To configure it:

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to Settings → API and copy:
   - Project URL → use as `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create a `.env.local` file in the project root (you can copy `.env.local.example`) and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart the dev server after adding environment variables.

If these variables are not set, the app will throw a clear error at startup.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home dashboard
│   ├── settings/          # Settings page with company table
│   ├── contacts/          # Contacts page
│   ├── status/            # Status monitoring page
│   └── layout.tsx         # Root layout with dashboard wrapper
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── sidebar-nav.tsx   # Sidebar navigation component
│   └── dashboard-layout.tsx # Main dashboard layout
└── lib/                  # Utility functions
    └── utils.ts          # Common utilities
```

## Settings Table Data Structure

The settings page displays company data with the following structure:

```typescript
{
  id: string,                    // UUID
  company_name: string,          // Company name
  company_logo: string,          // Logo filename
  company_address: {             // JSONB
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  contacts: {                    // JSONB
    email: string,
    phone: string,
    website: string
  },
  social_media_links: {          // JSONB
    facebook: string,
    twitter: string,
    linkedin: string
  }
}
```

## Development

The project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

## Build

To build for production:

```bash
npm run build
npm start
```
