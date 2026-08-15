# Discover در سایت شخصی — سند طراحی

**تاریخ:** 2026-08-15
**دامنه:** `alirezasafaeisystems.ir/discover`
**مخزن:** `alirezasafaei-dev/alirezasafaeisystems`

## هدف

افزودن یک surface داخلی برای Discover در سایت شخصی، با Header، Navbar، Footer، زبان، تم، SEO، احراز هویت و دیتابیس فعلی؛ بدون ساختن سایت یا پنل جدا.

## وضعیت واقعی قبل از اجرا

- اپ فعلی Next.js App Router با React/TypeScript، Prisma و Admin session است.
- مدل `Project` موجود است و فیلدهای محتوایی، لینک، `featured` و `order` دارد.
- تب Projects در Admin موجود است اما read-only است.
- API `/api/admin/projects` برای GET/POST موجود است و CRUD کامل ندارد.
- صفحه‌های Portfolio/Case Studies فعلاً محتوای route-based دارند.
- دایرکتوری اعلام‌شدهٔ کاربر (`Documents/alirezasafaeisystems`) dirty و شامل تغییرات sync قبلی است؛ اجرای feature در worktree تمیز از `origin/main` انجام می‌شود و تغییرات آن دایرکتوری دست‌نخورده می‌ماند.

## تصمیم معماری

### reuse

از موارد زیر مستقیماً استفاده می‌شود:

- Root layout و کامپوننت‌های Header/Footer/BottomNav
- I18n و locale routing فعلی
- session فعلی Admin و `enforceAdminAccess`
- `Project` و Prisma client فعلی
- validation، rate limit، logger و UI primitives فعلی
- الگوهای بالغ Admin/Discover در PersianToolbox فقط به‌عنوان reference؛ بدون runtime dependency و بدون تغییر آن repo

### تغییر حداقلی داده

برای جلوگیری از قاطی‌شدن Portfolio و Discover، به مدل فعلی `Project` فقط این دو فیلد اضافه می‌شود:

- `contentType`: enum محدود `portfolio | discover` با default=`portfolio`
- `published`: boolean با default=`true` برای حفظ backward compatibility

رکوردهای قدیمی بدون migration دستی و بدون تغییر معنایی، Portfolio و published باقی می‌مانند.

### public route

- `/discover` فارسی و `/en/discover` انگلیسی
- فقط `contentType=discover AND published=true`
- ترتیب: featured، سپس order، سپس createdAt
- metadata، canonical، hreflang، breadcrumb و structured data مطابق قرارداد موجود
- empty/loading/error state و keyboard accessibility

### Admin

همان تب Projects به manager مشترک Portfolio/Discover تبدیل می‌شود:

- فیلتر نوع محتوا و وضعیت انتشار
- create/edit/delete
- publish/unpublish
- featured
- sort order عددی و reorder امن
- preview لینک عمومی

API موجود حفظ می‌شود و با PATCH/DELETE تکمیل می‌گردد. تمام mutationها فقط JSON، احراز‌شده، rate-limited، validated و sanitized هستند.

## امنیت و حریم خصوصی

- credential جدید یا Basic Auth موازی ایجاد نمی‌شود.
- URL فقط HTTPS معتبر است و URL دارای username/password رد می‌شود.
- Draft در public page و sitemap نمایش داده نمی‌شود.
- خروجی عمومی شامل email، IP، session، user-agent یا credential نیست.
- هیچ CDN یا API runtime خارجی برای Discover اضافه نمی‌شود.

## Definition of Done

1. `/discover` و `/en/discover` با layout سایت شخصی render شوند.
2. Admin فعلی full CRUD برای Project/Discover داشته باشد.
3. publish/unpublish، featured و order بدون deploy کار کنند.
4. migration روی دادهٔ موجود backward-compatible باشد.
5. تست API، UI، accessibility، SEO، type-check، lint و build سبز باشند.
6. چرخهٔ واقعی local create → edit → publish → public → reorder → unpublish → delete با cleanup موفق باشد.
7. هیچ تغییر unrelated از دایرکتوری dirty یا repo PersianToolbox وارد PR نشود.

## rollout

ابتدا local روی Windows 11 و Node 22، سپس PR محدود و CI. انتشار production فقط بعد از green شدن gateها و تأیید release معمول repository انجام می‌شود.
