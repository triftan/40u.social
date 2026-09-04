# 40U Social Club

40U is a mobile-first social club for kids above 40: small, life-first gatherings for people who want more room for play, curiosity, and being with other humans. The public experience is optimized for readable type, generous touch targets, and warm, playful interactions.

## Product rules

The 40+ focus is an honour-system invitation. The app does not collect, infer, verify, or display a birth year. Registration collects only the member's name, email, birthday month, and birthday day. Members must authenticate before registering and can see only their own registrations. Administrator access is restricted in the database and interface to `triftan88@gmail.com`.

## Local setup

Install dependencies with `pnpm install`. Create a local `.env` file from the deployment variables below. Run `pnpm dev` for the development server, `pnpm check` for TypeScript validation, `pnpm test` for Vitest, and `pnpm build` for the production build.

## Supabase setup

Open the Supabase SQL Editor for the project at `https://tpoljhniatyyagfuhgtd.supabase.co` and run [`supabase/schema.sql`](./supabase/schema.sql). This creates the events and registrations tables, indexes, admin helper, and row-level-security policies. In Supabase Authentication, keep email/password enabled and configure the site URL and redirect URLs for both local development and the Vercel domain. The administrator signs up with `triftan88@gmail.com`; the RLS admin helper recognizes that email and no other account.

The client requires the following public environment variables. The anon key is safe for browser use when RLS is enabled; never put a Supabase service-role key in Vercel client variables or source control.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL, currently `https://tpoljhniatyyagfuhgtd.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase browser anon/public key |

## GitHub and Vercel

The intended repository is `https://github.com/triftan/40u.social`. Push this project to that repository, then connect the repository to the existing Vercel project. Enable automatic deployments from the chosen production branch and add the two `VITE_` variables in Vercel Project Settings for Preview and Production environments. After changing Supabase redirect URLs, redeploy the Vercel project.

The initial public page includes tasteful fallback event cards so the experience remains reviewable before the SQL is run. Once the Supabase schema is installed, published upcoming events replace the fallback content. The admin page at `/admin` is still protected by Supabase session email and database RLS.

## Important launch checks

Before launch, verify email confirmation and password reset redirect URLs, run the RLS policies against a member account and the administrator account, test a full-capacity event, and check that a member cannot query another member's registration. Do not seed testimonials, ratings, or reviews; 40U should show real community feedback only after it exists.
