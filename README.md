# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/79b5d77e-877e-4e8a-b1a9-e94aaaac0f78

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/79b5d77e-877e-4e8a-b1a9-e94aaaac0f78) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/79b5d77e-877e-4e8a-b1a9-e94aaaac0f78) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Admin — Supabase setup

Follow these steps to create an admin user for the site's admin panel:

1. Open your Supabase project and go to **Authentication → Users**.
2. Click **Invite user** or **Create new user** and create a user with the admin email you want to use (set a secure password).
3. In the SQL editor (or via migrations), ensure there is a matching row in `public.admin_users` with the same email. A seed file is included at `supabase/migrations/20251221000000_seed_admin_user.sql`.

Quick SQL example to run in Supabase SQL editor (replace the email):

```sql
INSERT INTO public.admin_users (email, password_hash, full_name, role, is_active)
VALUES ('admin@example.com', 'placeholder', 'Site Administrator', 'admin', true)
ON CONFLICT (email) DO NOTHING;
```

Notes:
- The `admin_users` table is used for role checks; Supabase Auth stores actual passwords. Make sure the Auth user email matches the `admin_users.email` exactly.
- After creating the Auth user and the `admin_users` row, sign in at `/admin` with the Auth email/password.
- For production use, replace the placeholder and manage users securely via the Supabase Dashboard or Admin API.

Quick create Auth user (Admin API)

You can create the Supabase Auth user programmatically using the service_role key. Replace `${SUPABASE_URL}`, `${SERVICE_ROLE_KEY}`, `<ADMIN_EMAIL>` and `<ADMIN_PASSWORD>` with your project values.

```bash
# Create Supabase Auth user (requires service_role key)
curl -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>","email_confirm":true}'
```

Once the Auth user exists and the `admin_users` row (see `supabase/migrations/20251221000000_seed_admin_user.sql`) contains the same email, you can sign in at `/admin` using the Auth credentials you created.

IMPORTANT: Do NOT commit plaintext passwords into the repository or shared docs. Use secure channels to share credentials and rotate passwords immediately after first sign-in.

### Admin creation endpoint (optional)

If you'd rather create admin users programmatically, the project provides a protected server endpoint at `POST /api/create-admin`.

Environment variables required on the server:
- `SUPABASE_URL` — your Supabase project URL (e.g. https://xyz.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service_role key (keep secret)
- `ADMIN_CREATION_KEY` — a server-side secret used to protect the endpoint

Example curl to create an admin (replace placeholders and use your `ADMIN_CREATION_KEY`):

```bash
curl -X POST https://your-server.example.com/api/create-admin \
  -H "Content-Type: application/json" \
  -H "x-admin-key: ${ADMIN_CREATION_KEY}" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>","full_name":"<FULL_NAME>"}'
```

The endpoint will:
- create the Supabase Auth user via the Admin API
- insert a matching row into `public.admin_users`

Security: keep `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_CREATION_KEY` in a secure server environment and never commit them.

