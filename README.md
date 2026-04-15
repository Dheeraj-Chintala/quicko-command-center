# Quicko Command Center

## Admin dashboard (Supabase)

Live dashboard data uses the Supabase client with **Row Level Security** from [`supabase_migrations/completeschema.sql`](supabase_migrations/completeschema.sql). Policies use `is_admin()`, which is true when the JWT has `app_metadata.role === "admin"`.

**Set admin on a user** (Supabase Dashboard → Authentication → user → edit **App metadata**):

```json
{ "role": "admin" }
```

Without this, live queries return empty rows or errors. Use the navbar toggle **Demo** to use static sample data instead.

**Admin verification (drivers & documents)** — after applying the base schema, run [`supabase_migrations/admin_verify_policies.sql`](supabase_migrations/admin_verify_policies.sql) in the Supabase SQL editor. It adds RLS policies so `is_admin()` can `UPDATE` `drivers`, `driver_documents`, and `vehicles` (approve/reject applications, verify docs, mark vehicles verified). The browser app never uses the Postgres superuser or `service_role` key; admin access is JWT + RLS only.

The **Driver Applications** page and dashboard **Pending Approvals** use these updates. Rejecting a document from the dashboard still requires a note — use the X link to open the full application review.

Environment: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`.

Regenerate TypeScript types after schema changes:

```bash
npx supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts
```
