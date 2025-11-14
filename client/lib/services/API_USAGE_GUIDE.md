# API Request Guide - Sending JWT Cookies

## Overview

Your JWT is stored in an httpOnly cookie and needs to be sent with every authenticated request.

## Client-Side Requests (Browser)

### ✅ Already Working!

Your [baseUrl.js](./baseUrl.js) has `withCredentials: true`, so cookies are **automatically sent** with every client request.

### Usage in Client Components:

```javascript
"use client";

import { getUserProfile } from "@/lib/services/userServices";
import { useEffect, useState } from "react";

export default function ProfileComponent() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const result = await getUserProfile("user123");
      if (result.success) {
        setProfile(result.data);
      }
    }
    fetchProfile();
  }, []);

  return <div>{profile?.name}</div>;
}
```

### How it works:
- ✅ Browser automatically includes cookies
- ✅ `withCredentials: true` ensures cookies are sent cross-origin
- ✅ No manual token handling needed

---

## Server-Side Requests (Server Actions & Server Components)

### ⚠️ Requires Manual Cookie Forwarding

Server-side requests don't have access to browser cookies, so you must manually extract and send them.

### Usage in Server Actions:

```javascript
"use server";

import { serverApiRequest } from "@/lib/services/serverApi";

export async function updateProfileAction(formData) {
  const data = {
    name: formData.get("name"),
    bio: formData.get("bio"),
  };

  // JWT cookie is automatically extracted and sent
  const result = await serverApiRequest("patch", "/api/v1/users/updateMe", data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
```

### Usage in Server Components:

```javascript
import { serverApiRequest } from "@/lib/services/serverApi";

export default async function ProfilePage() {
  // JWT cookie is automatically extracted and sent
  const result = await serverApiRequest("get", "/api/v1/users/me");

  if (!result.success) {
    return <div>Failed to load profile</div>;
  }

  const user = result.data;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### How it works:
1. `createServerApi()` reads the JWT from Next.js cookies
2. Adds it to the `Cookie` header: `Cookie: jwt=<token>`
3. Backend receives and validates the JWT
4. ✅ Authenticated request

---

## Quick Reference

| Context | Import | Function |
|---------|--------|----------|
| **Client Component** | `import api from "@/lib/services/baseUrl"` | `api.get()`, `api.post()`, etc. |
| **Server Action** | `import { serverApiRequest } from "@/lib/services/serverApi"` | `serverApiRequest("get", "/path")` |
| **Server Component** | `import { serverApiRequest } from "@/lib/services/serverApi"` | `serverApiRequest("get", "/path")` |

---

## Common Patterns

### 1. Fetch Data in Client Component
```javascript
"use client";
import api from "@/lib/services/baseUrl";

const response = await api.get("/api/v1/posts");
```

### 2. Fetch Data in Server Component
```javascript
import { serverApiRequest } from "@/lib/services/serverApi";

const response = await serverApiRequest("get", "/api/v1/posts");
```

### 3. Submit Form in Server Action
```javascript
"use server";
import { serverApiRequest } from "@/lib/services/serverApi";

export async function createPost(formData) {
  const data = { title: formData.get("title") };
  const response = await serverApiRequest("post", "/api/v1/posts", data);
  return response;
}
```

### 4. Update Data in Client (e.g., onClick)
```javascript
"use client";
import api from "@/lib/services/baseUrl";

async function handleLike(postId) {
  await api.post(`/api/v1/posts/${postId}/like`);
}
```

---

## Important Notes

### ✅ Security Features Already Configured:
- httpOnly cookie (prevents XSS attacks)
- secure flag (only sent over HTTPS)
- sameSite flag (prevents CSRF attacks)
- withCredentials: true (sends cookies with requests)

### 🔒 Backend Requirements:
Your backend must:
1. Accept the `Cookie` header with JWT
2. Have CORS configured with `credentials: true`
3. Allow the frontend origin

Example backend CORS config (Express.js):
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

---

## Troubleshooting

### Cookie not being sent?
1. Check `withCredentials: true` is in axios config
2. Verify cookie exists: `document.cookie` in browser console
3. Check cookie domain/path settings
4. Ensure HTTPS in production (required for secure cookies)

### 401 Unauthorized errors?
1. Check if JWT cookie exists and is valid
2. Verify backend is reading the cookie correctly
3. Check token expiration
4. Ensure backend CORS allows credentials
