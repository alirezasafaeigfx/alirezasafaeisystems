# Discover — Local Windows 11 Runbook

## Scope

این runbook برای اجرای local Discover داخل سایت شخصی است. هیچ دستور آن به PersianToolbox یا production نیاز ندارد.

## Prerequisites

- Windows 11
- Node.js 22 مطابق `.nvmrc`/`.node-version`
- pnpm نسخهٔ تعریف‌شده در `package.json`
- Git و دسترسی local به repository

## Setup

```powershell
cd C:\Users\ASDEV\Documents\alirezasafaeisystems-discover-work
pnpm install --frozen-lockfile
pnpm db:generate
```

مقادیر واقعی secret را در فایل commit‌شده قرار ندهید. برای local از `.env.local` مطابق `.env.example` استفاده کنید.

## Database

قبل از migration از دیتابیس local backup بگیرید. سپس migration رسمی Prisma را اجرا کنید:

```powershell
pnpm exec prisma migrate dev
```

دیتابیس local و migration output نباید commit شوند.

## Verification

```powershell
pnpm lint
pnpm type-check
pnpm test
pnpm build
pnpm dev
```

در browser این مسیرها را بررسی کنید:

- `http://localhost:3000/discover`
- `http://localhost:3000/en/discover`
- `http://localhost:3000/admin`

## CRUD smoke

با یک رکورد موقت Discover این چرخه را اجرا کنید:

1. Create به‌صورت Draft
2. Edit عنوان، توضیح، لینک HTTPS و tags
3. Publish و مشاهده در `/discover`
4. تغییر featured و order
5. Unpublish و اطمینان از حذف از public page
6. Delete و اطمینان از حذف از Admin و public query

پس از تست، رکورد موقت و هر فایل database/report تولیدشده را از working tree خارج کنید.

## Failure handling

- خطای Prisma: ابتدا `pnpm db:generate` و وضعیت `DATABASE_URL` را بررسی کنید.
- خطای Admin 401: فقط از local `ADMIN_USERNAME`, `ADMIN_PASSWORD` و `ADMIN_SESSION_SECRET` استفاده کنید؛ secret را چاپ نکنید.
- خطای build/type: root cause را در کد یا قرارداد تست اصلاح کنید؛ تست را حذف یا ضعیف نکنید.
- هر تغییر production در این مرحله ممنوع است.
