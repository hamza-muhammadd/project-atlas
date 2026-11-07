# Quick start (config already included)
1. Supabase > SQL Editor > paste all of `supabase/schema.sql` > Run.
2. Supabase > Authentication > Users > Add user (your email + password, tick auto-confirm). Then Auth settings > turn off "Allow new users to sign up".
3. Run: `npm start` and open http://localhost:5173. Or push to GitHub and import into Vercel (no env vars needed; `config.js` holds the public anon key).

# Project Atlas: The Universal Mind (Phase 1)

## Run locally
1. Create a Supabase project. In Auth settings, create your owner user and **disable public sign-ups**.
2. Run `supabase/schema.sql` in the SQL editor (tables, indexes, RLS on every table, 4 private storage buckets with owner-folder policies).
3. `cp .env.example .env` and fill `SUPABASE_URL` and `SUPABASE_ANON_KEY` (anon key only; never the service-role key).
4. `npm start` (Node 18+), open http://localhost:5173 and sign in.

## Working in Phase 1
Sign-in, collapsible sidebar and routing, Ctrl+K search into the vault, dashboard with live counts, recent resources and activity from Supabase, resource metadata CRUD (search, filter, sort, edit, confirmed delete), persistent Knowledge Club CRUD, custom dropdowns, modals, toasts, loading/empty/error states. Failed database calls show errors, never fake success.

## Not built yet (labelled "Coming soon" in the UI)
File upload to Storage, PDF extraction, IndexedDB cache/sync layer, Ask Anything and Edge Functions (Phase 3), Professor, Research Lab, Knowledge Graph, Learning Paths, Practice Lab, Mastery Tracker, Settings/Export, `/admin` panel. Dashboard hero progress ring, graph preview and Continue Learning are placeholders until real data exists.

## Notes
Untested against a live Supabase project (no credentials were available). Sidebar icons are unicode placeholders; swap in an SVG set later.

## Deploy to Vercel
1. Push the folder to a Git repo and import it in Vercel (framework: Other).
2. Add env vars `SUPABASE_URL` and `SUPABASE_ANON_KEY` (anon key only) in Project Settings.
3. Deploy. `vercel.json` runs `npm run build`, which writes `config.js` from those vars.
4. In Supabase Auth settings, set Site URL to your Vercel domain. Keep public sign-ups off.
Edge Functions (Phase 3) deploy to Supabase, not Vercel. The future `/admin` folder works as static files at `/admin/`.
