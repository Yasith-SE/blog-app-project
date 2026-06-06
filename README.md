# BlogApp Gateway

A modern, full-stack blog publication application built as an internship assessment project. The application features a clean, professional interface for managing and distributing technical content.

## Technology Stack
* **Frontend:** Next.js (App Router), React
* **Styling:** Tailwind CSS v4
* **Backend & Database:** Supabase (PostgreSQL)
* **Payments:** Stripe (Upcoming)

## Features
* **Free Posts Section:** Publicly accessible articles with real-time title search.
* **Content Management:** Dedicated dashboard for creating and formatting posts.
* **Visibility Controls:** Toggle posts between public, draft, and premium statuses.
* *(Upcoming)* **Premium Subscriptions:** Paywall integration for exclusive content.

## Getting Started
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key