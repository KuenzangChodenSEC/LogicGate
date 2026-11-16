<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/91ac11bf-b40e-45f0-b1dc-ed7a6cfadf1b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. The app includes the public client settings for its Supabase project. To use a different project, copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. These are public client settings, not service-role secrets.
3. Run `supabase/migrations/20261117000000_shared_profiles_and_avatars.sql` in the Supabase SQL Editor. Enable email authentication and configure the app URL and redirect URL in Supabase Authentication settings.
4. Set the `GEMINI_API_KEY` in `.env.local` if you use Gemini AI features.
5. Run the app:
   `npm run dev`

Accounts, learning progress, and profile pictures are stored in Supabase so they can be used across devices. To migrate a browser-only account, sign up with the same email on its original device; if email confirmation is enabled, complete confirmation and log in there before using the account on another device. Passwords are handled by Supabase Auth and are not stored in profile data.
