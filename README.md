# PromptReel

AI-powered video generation platform with Vercel Web Analytics integrated.

## Features

- Next.js 16 with App Router
- TypeScript support
- Tailwind CSS styling
- **Vercel Web Analytics** - Fully configured and ready to use

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Vercel Web Analytics

This project has Vercel Web Analytics pre-configured following the official [Vercel Analytics Quickstart Guide](https://vercel.com/docs/analytics/quickstart).

### What's Configured

- ✅ `@vercel/analytics` package installed
- ✅ `<Analytics />` component added to root layout (`app/layout.tsx`)
- ✅ Analytics will automatically track pageviews and events when deployed to Vercel

### Enabling Analytics on Vercel

After deploying to Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to **Analytics** in the sidebar
3. Click **Enable** to activate Web Analytics
4. Analytics data will start appearing after your next deployment

### Local Development

Analytics are automatically disabled in development mode and only track when deployed to Vercel.

## Environment Variables

Configure your environment variables based on the `vercel.env` file. See that file for available configuration options.

## Build

```bash
npm run build
```

## Deploy

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
