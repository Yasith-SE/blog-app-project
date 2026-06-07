# BlogApp Gateway

A full-stack blog publication app built with Next.js, Supabase, and Stripe. The app supports public blog posts, an authenticated author dashboard, premium post controls, and Stripe Checkout subscriptions.

## Technology Stack

* **Frontend:** Next.js App Router, React
* **Styling:** Tailwind CSS v4
* **Backend & Database:** Supabase PostgreSQL and Supabase Auth
* **Payments:** Stripe Checkout in sandbox mode

## Features

* **Public Blog Feed:** Displays published posts with real-time title search.
* **Aligned Home UI:** Blog cards are arranged in a responsive grid with visible titles and readable content text.
* **Author Dashboard:** Authenticated users can create posts and choose public/premium visibility.
* **Free Tier Word Limit:** Free authors are prompted to get Premium when the content body reaches 60 words.
* **Premium Plans Page:** Subscription page includes Standard and Elite plan cards.
* **Stripe Checkout:** Standard and Elite buttons create subscription Checkout sessions using configured Stripe price IDs.
* **Console Error Cleanup:** Supabase profile lookup and checkout failures now show UI messages instead of noisy browser console errors.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_STANDARD_PRICE_ID=price_for_standard_plan
   STRIPE_ELITE_PRICE_ID=price_for_elite_plan
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Available Scripts

* `npm run dev` - starts the local development server.
* `npm run lint` - runs ESLint checks.
* `npm run build` - builds and type-checks the project.

## Notes

Stripe prices are recurring monthly prices, so Checkout uses `subscription` mode. Supabase profile rows should include an `is_subscribed` field for premium access checks.

For Vercel deployments, add the same `.env.local` values in **Project Settings > Environment Variables**. Local `.env.local` files are not uploaded to GitHub or Vercel.
