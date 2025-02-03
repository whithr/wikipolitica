# wikipolitica

a free non-partisan and open-source political knowledge base for the United States

**Dev Setup instructions**

Thanks for your interest in contributing! Here's how to get started.
The app is split into 3 parts:

- Frontend (/apps/web) - a typical react setup with vite
- Job Runner (/apps/server) - The frontend does not talk to this, this is essentially just a node service that runs cron jobs to fill the database. The frontend does not rely on this being up and running, only run this if you want to continue populating your local database.
- Database (/apps/database) - we use this as a Backend-as-a-service. The front end reads directly with the anon key from the database. There are no users to consider, everything currently is read-only.

**Steps for setting up Database**

Install supabase globally, https://supabase.com/docs/guides/local-development/cli/getting-started

1. cd into /apps/database
2. run `supabase start`
3. take note of the `anon key` and `service_role key` and `api_url` for the `.env` file we will need to make
4. run `supabase db reset`
5. Your database should be seeded with data up to 2/2/2025

**Steps for Frontend**

1. Create an `.env` file in /apps/web, with the keys `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, fill them with the `api_url` and `anon_key` respectively.
2. from the root directory: `pnpm install`
3. From the root directory: `pnpm dev:web`
4. you should see the app loaded with data at `localhost:5713`

**Steps for Backend**

1. This is only needed if you are writing jobs to fetch data, the frontend or database does not require this. This service only runs jobs.
2. create an `.env` file in /apps/server with the keys `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GEOCODE_API_KEY`, and `CONGRESS_GOV_API_KEY` the first two supabase ones are from setting up the database.
3. `pnpm dev` will start the server.
