# Project Fixed

## Problems Fixed
- Fixed `localStorage is not defined`
- Fixed missing `DATABASE_URL`
- Added `.env`
- Switched Prisma to SQLite for easy local تشغيل
- Removed Turbopack HMR crash
- Prepared NextAuth environment variables

## Run The Project

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Then open:

http://localhost:3000
