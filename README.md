# paircode

## Features
- Pair video call with LSP supported Real Time editor
- VSCode Extension to import code directly [See more](https://paircode.live/vscode-extension)

## Getting Started

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
```

**All the envs needed are listed. Make sure to keep the envs same with the same name even for different files.**

```
SERVER ENVS -

BETTER_AUTH_SECRET= # generate using openssl rand -base64 64. Keep it same as web
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
JWT_SECRET= # generate using openssl rand -base64 64. Keep it same as web
NODE_ENV='development'
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

WEB ENVS -

NEXT_PUBLIC_SERVER_URL=http://localhost:3000
USER_EMAIL=
RECIPIENT_EMAIL= # for mailing yourself about something
USER_EMAIL_PASS= # check how to create app passwords: https://support.google.com/accounts/answer/185833?hl=en
JWT_SECRET= # generate using openssl rand -base64 64. keep it same as server
BETTER_AUTH_SECRET= # generate using openssl rand -base64 64. Keep it same as server
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

PACKAGES ENVS -

AUTH ENVS-

CORS_ORIGIN=http://localhost:3001
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### Database Setup

This project uses PostgreSQL with Drizzle ORM. After setting up the required env variable `DATABASE_URL`, now apply the migrations and generate with the below command from root.

3. Apply the schema to your database:
```bash
bun run turbo db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

### Docker setup

Backend setup with docker. This follows the pattern mentioned in [official docs](https://turborepo.com/docs/guides/tools/docker). Based on the docs, we separated the workspace of backend first. 

Build with the command below
```
docker build -t paircode-be -f apps/server/Dockerfile .
```

After successful build, run it with the .envs required.
```
docker run -d -p 3000:3000 --net=host --env BETTER_AUTH_SECRET="" --env BETTER_AUTH_URL="" --env JWT_SECRET="" --env GOOGLE_CLIENT_ID="" --env GOOGLE_CLIENT_SECRET="" --env DATABASE_URL="" paircode-be:latest
```

Open your browser and check `http://localhost:3000/health`

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

## Tech Stack

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Express, and more.

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Express** - Fast, unopinionated web framework
- **Express Rate Limit** - Basic IP rate-limiting middleware for Express
- **ws** - Wbsocket client and server for Node.js
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system

and webRTC apis provided by browser