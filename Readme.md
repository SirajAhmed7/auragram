# Auragram

A full-stack social media application with posts, nested comments, and user authentication.

###Visit live at [auragram.vercel.app](https://auragram8.vercel.app/)

## Tech Stack

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

**Frontend**

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Axios

## Features

- User authentication (signup/login with JWT)
- Create, edit, and delete posts
- Nested comments and replies (up to 10 levels)
- Like posts and comments
- User profiles
- Protected routes and owner-only permissions

## Getting Started

1. Install dependencies:

```bash
cd server && pnpm install
cd ../client && pnpm install
```

2. Set up environment variables:

- Create `.env` in `server/` with MongoDB URI, JWT secret, etc.
- Create `.env.local` in `client/` with `NEXT_PUBLIC_BASE_URL=http://localhost:8000/`

3. Run the application:

```bash
# Terminal 1 - Server
cd server
pnpm start

# Terminal 2 - Client
cd client
pnpm dev
```

The app will be available at `http://localhost:3000`
