# Project Tasks

## Phase 1: Setup & Public Blog Feed

- [x] Initialize the Next.js App Router project.
- [x] Configure Tailwind CSS v4 styling.
- [x] Connect the app to Supabase.
- [x] Create and use the `posts` table.
- [x] Display published blog posts on the home page.
- [x] Add real-time title search on the home page.
- [x] Fix home page alignment and make post titles visible on white cards.

## Phase 2: Authentication & Dashboard

- [x] Build login and registration pages with Supabase Auth.
- [x] Secure the dashboard route by checking the current authenticated user.
- [x] Build the post creation dashboard.
- [x] Add published and premium post controls.
- [x] Add a 60-word free tier limit with a "Get Premium" popup.
- [x] Avoid Supabase `406` profile errors by using optional profile lookup.
- [ ] Add edit/delete controls for existing posts.
- [ ] Improve dashboard post management with a list of the user's existing posts.

## Phase 3: Premium Subscriptions

- [x] Create a subscription pricing page.
- [x] Create Stripe sandbox products and recurring prices for Standard and Elite plans.
- [x] Add `STRIPE_STANDARD_PRICE_ID` and `STRIPE_ELITE_PRICE_ID` configuration.
- [x] Create Stripe Checkout sessions from `/api/checkout`.
- [x] Use Stripe Checkout `subscription` mode for recurring monthly prices.
- [x] Show user-friendly checkout messages instead of browser console errors.
- [ ] Add a Stripe webhook to update `profiles.is_subscribed` after successful payment.
- [ ] Protect premium content using Supabase Row Level Security.
- [ ] Add premium content display rules for subscribed readers.

## Phase 4: Final Polish

- [x] Run ESLint successfully.
- [x] Run a production build successfully.
- [ ] Add final screenshots or demo notes for submission.
- [ ] Review responsive layouts on mobile and desktop.
