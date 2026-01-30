# Claritas Frontend (Hackathon MVP)

## Quick start
1) Install deps
```bash
npm install
```

2) Copy env
```bash
cp .env.example .env
```
Fill `VITE_GOOGLE_CLIENT_ID`.

3) Run
```bash
npm run dev
```

## Notes
- Landing page uses Google Sign-In button in the navbar.
- After success, it redirects to `/dashboard`.
- Backend call to `/auth/google` is optional (you can comment it out in `GoogleSignInButton.tsx`).
