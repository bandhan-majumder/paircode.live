# Guide for contributors

We appreciate open source contributions. Make sure you follow these rule before contributing;

1. Don't spam
2. Be impactful with changes. Unnecessary changes will be closed
3. Provide detailed description with proof of changes if you want your code to get merged
4. Make sure to check every edge cases locally before pushing. You are responsible for the code you add in PR.
5. Add meaningful commit message and PR description

## Project Structure

```
paircode/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Express)
├── packages/
│   ├── config/      # Base configs
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Getting Started

### Requirements

Bun (install from [here](https://bun.com/docs/installation))

Optional (if you want backend to run on docker)
Docker (install from [here](https://docs.docker.com/engine/install))

First, install the dependencies:

```bash
bun install
```

### Manual Setup

#### Setup envs

Create .env files from the preset .env.examples files with the below command.

```
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp packages/auth/.env.example packages/auth/.env
cp packages/db/.env.example packages/db/.env
```

**All the envs needed are listed. Make sure to keep the envs same with the same
name even for different files.**

```
1. SERVER ENVS -

    JWT_SECRET= # generate using openssl rand -base64 64. Keep it same as web

2. WEB ENVS -

    NEXT_PUBLIC_SERVER_URL=http://localhost:3000
    USER_EMAIL=
    RECIPIENT_EMAIL= # for mailing yourself about something
    USER_EMAIL_PASS= # check how to create app passwords: https://support.google.com/accounts/answer/185833?hl=en
    JWT_SECRET= # generate using openssl rand -base64 64. keep it same as server
    BETTER_AUTH_SECRET= # generate using openssl rand -base64 64. Keep it same as server
    BETTER_AUTH_URL=http://localhost:3000
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    DATABASE_URL=
    NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
    BETTER_AUTH_URL=http://localhost:3001

3. PACKAGES ENVS -

    1. AUTH ENVS-

        CORS_ORIGIN=http://localhost:3001
        GOOGLE_CLIENT_ID=
        GOOGLE_CLIENT_SECRET=

    2. DB ENVS-

        DATABASE_URL=
```

#### Database Setup

This project uses PostgreSQL with Drizzle ORM. After setting up the required env
variable `DATABASE_URL`, now apply the migrations and generate with the below
command from root.

3. Apply the schema to your database:

```bash
bun run turbo db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the
web application. The API is running at
[http://localhost:3000](http://localhost:3000).

### Docker setup

**Backend setup with docker.**

This follows the pattern mentioned in
[official docs](https://turborepo.com/docs/guides/tools/docker). Based on the
docs, we separated the workspace of backend first.

Go to the root of the project and build the image the command below

```
docker build -t server-dockerfile -f apps/server/Dockerfile .
```

After successful build, run this from **root** of the project. Make sure you
have `.env` present at `apps/server/.env`

```
sudo docker run -d \
--net=host \
--name paircode-be \
--env-file apps/server/.env \
paircode-be-img:latest
```

Open your browser and check `http://localhost:3000/health`