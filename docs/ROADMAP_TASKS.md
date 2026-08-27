# نقشه راه و تسک‌بندی اولویت‌بندی‌شده

**تاریخ به‌روزرسانی:** 2026-08-27  
**وضعیت:** Active — Personal Brand Homepage V3  
**Spec مرجع:** `docs/product/PERSONAL_BRAND_HOMEPAGE_V3.md`  
**اهداف مرجع:** `docs/ROADMAP_OBJECTIVES.md`

> این فایل از این تاریخ backlog فعال پروژه را نشان می‌دهد. جزئیات تسک‌های تکمیل‌شده قبلی در تاریخچه Git محفوظ است و نباید دوباره به‌عنوان اولویت فعال اجرا شود.

## اصول اجرا

- **P0:** تغییرات ضروری برای positioning، UX و conversion صفحه اصلی.
- **P1:** SEO، analytics، service IA، accessibility و performance مرتبط با V3.
- **P2:** رشد مبتنی بر داده، proof enrichment و content moat.
- هر تسک باید evidence، acceptance criteria و نتیجه تست داشته باشد.
- هیچ metric، testimonial، client claim یا portrait جعلی ساخته نشود.
- production فقط از مسیر release/deploy موجود پروژه تغییر کند.

---

# P0 — Personal Brand & Homepage Conversion

## [ ] `P0-PBH-1` — Canonical identity alignment

**مالک:** Product + FE + SEO  
**وابستگی:** ندارد  
**شرح:** تمام source-of-truthهای مرتبط را با هویت جدید همسو کن: «علیرضا صفایی / Alireza Safaei — مهندس نرم‌افزار / Software Engineer». عنوان قدیمی `Web Systems Engineer` فقط به‌عنوان specialization قابل استفاده است، نه primary public title.

**خروجی:**
- brand config/code
- metadata/schema copy
- UI strings
- repo/docs references مرتبط
- audit mismatch report

**پذیرش:** نام و primary title در hero، metadata، Person JSON-LD، FA/EN و brand source of truth یکسان باشند؛ لینک repo قدیمی باقی نماند.

---

## [ ] `P0-PBH-2` — Personal hero + portrait contract

**مالک:** FE + Product + QA  
**وابستگی:** `P0-PBH-1`  
**شرح:** Hero فعلی متراکم را به personal-brand hero تبدیل کن: portrait واقعی مالک، نام، H1 «مهندس نرم‌افزار»، value proposition کوتاه و فقط دو CTA اصلی.

**CTAها:**
1. `شروع همکاری` → collaboration/qualification canonical route
2. `مشاهده پروژه‌ها` → `/case-studies`

**محدودیت:** اگر portrait واقعی تاییدشده در repo/ورودی موجود نیست، layout را با placeholder خنثی کامل کن و فقط asset swap را باز بگذار؛ چهره AI تولید نکن.

**خروجی:** hero responsive برای FA/EN + تست targeted desktop/mobile.

**پذیرش:**
- یک H1
- دقیقاً دو CTA dominant
- no CLS from portrait
- RTL/LTR صحیح
- keyboard/focus/reduced-motion صحیح
- hero بدون intent-router/page-roadmap/competing product CTA

---

## [ ] `P0-PBH-3` — Homepage IA simplification

**مالک:** Product + FE  
**وابستگی:** `P0-PBH-2`  
**شرح:** Home را تقریباً 30–40٪ کوتاه‌تر و تصمیم‌پذیرتر کن؛ بخش‌های تکراری capability/workflow/trust را ادغام یا حذف کن.

**IA هدف:**
1. Header
2. Personal Hero
3. سه Core Service
4. سه Selected Project
5. Proof/Outcomes
6. Engineering Principles
7. Short About
8. Simple Contact CTA
9. Footer

**پذیرش:** کاربر برای فهم پیشنهاد اصلی مجبور به فهم Audit Systems/PersianToolbox/Qualification architecture نباشد؛ هیچ dead-end CTA ایجاد نشود.

---

## [ ] `P0-PBH-4` — Selected work & evidence-first proof

**مالک:** Product + FE + QA  
**وابستگی:** `P0-PBH-3`  
**شرح:** حداکثر سه پروژه قوی را روی Home نشان بده؛ اولویت با proof واقعی بیرونی/محصول زنده است. گزینه‌های پایه: PersianToolbox، Novax، Audit Systems. self-case-study سایت flagship نباشد.

**پذیرش:**
- حداکثر 3 کارت
- context + role + evidence-backed outcome
- metric بدون source/methodology نمایش داده نشود
- هر کارت به case study یا proof route معتبر متصل باشد

---

# P1 — Funnel, SEO, Analytics, Quality

## [ ] `P1-PBH-1` — Contact & qualification repositioning

**مالک:** Product + FE  
**وابستگی:** P0 complete  
**شرح:** Qualification حفظ شود اما مرحله دوم funnel باشد. Home ابتدا trust و intent ایجاد کند و سپس collaboration را شروع کند.

**پذیرش:** مسیر تماس کوتاه و واضح باشد؛ qualification functionality/regression نداشته باشد؛ CTAهای تکراری حذف شوند.

---

## [ ] `P1-PBH-2` — SEO metadata + entity/schema alignment

**مالک:** SEO + FE  
**وابستگی:** `P0-PBH-1`, `P0-PBH-3`  
**شرح:** homepage metadata، Person schema، canonical/hreflang/inLanguage و internal linking را با personal-brand/software-engineer positioning همسو کن.

**عنوان جهت‌گیری:**
- FA: `علیرضا صفایی | مهندس نرم‌افزار و سیستم‌های وب`
- EN: `Alireza Safaei | Software Engineer — Web Systems & Production`

**پذیرش:** یک canonical صحیح، hreflang FA/EN/x-default صحیح، Person jobTitle صحیح، structured data معتبر، sitemap/robots بدون regression.

---

## [ ] `P1-PBH-3` — Commercial service landing IA

**مالک:** Product + SEO + FE  
**وابستگی:** `P1-PBH-2`  
**شرح:** intentهای تجاری را از Home جدا کن و routeهای dedicated را ایجاد/تقویت کن.

**intentهای اولویت‌دار:**
1. توسعه سیستم/محصول وب
2. نجات و تکمیل پروژه نیمه‌کاره
3. پایدارسازی/بهینه‌سازی سیستم وب
4. technical SEO/audit در صورت fit تجاری
5. infrastructure/localization فقط اگر service واقعی و قابل فروش است

**پذیرش:** هر landing یک intent، H1، metadata، proof، CTA و internal link مشخص داشته باشد؛ thin/duplicate page تولید نشود.

---

## [ ] `P1-PBH-4` — Analytics contract simplification

**مالک:** FE + Analytics  
**وابستگی:** `P0-PBH-2`, `P0-PBH-3`  
**شرح:** eventهای obsolete مرتبط با hero intent-router/A-B path قدیمی را بازنشسته کن و event set اصلی را تثبیت کن.

**Minimum events:**
- `hero_impression`
- `hero_primary_cta_click`
- `hero_projects_cta_click`
- `project_card_click`
- `contact_cta_click`
- `qualification_start`
- `qualification_submit_success`

**خروجی:** code + `docs/EVENT_TAXONOMY.md` update.

**پذیرش:** event duplicate/ambiguous وجود نداشته باشد و CTAهای اصلی قابل اندازه‌گیری باشند.

---

## [ ] `P1-PBH-5` — Responsive, A11y & performance gate

**مالک:** QA + FE  
**وابستگی:** P0/P1 implementation  
**شرح:** V3 را روی mobile/desktop، FA/EN، keyboard و performance verify کن.

**حداقل فرمان‌ها:**
```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

**پذیرش:**
- هیچ Critical/Serious Axe violation
- هیچ console error در flow اصلی
- Lighthouse Performance >=95 در محیط پایدار
- Accessibility >=95
- Best Practices >=95
- SEO target 100
- portrait بدون CLS محسوس
- no secret/private asset committed

---

# P2 — Evidence, Content & CRO

## [ ] `P2-PBH-1` — Case-study evidence enrichment

**مالک:** Product + Analytics  
**وابستگی:** V3 live  
**شرح:** metricهای case study را با Before/After، measurement window و source/methodology قابل ردیابی کن. testimonial فقط در صورت واقعی/مجاز بودن اضافه شود.

**پذیرش:** claim بدون evidence حذف یا qualitative شود.

---

## [ ] `P2-PBH-2` — First-party Insights / topical authority

**مالک:** SEO + Content  
**وابستگی:** service IA stable  
**شرح:** topical authority دامنه اصلی را حول software engineering/web systems بساز؛ محتوا باید به service/case-study funnel داخلی لینک شود.

**موضوعات پایه:** production readiness، پروژه نیمه‌کاره، performance/reliability، web architecture، operational constraints ایران.

**پذیرش:** هر محتوا search intent روشن، author/entity connection، internal links و CTA مرتبط داشته باشد؛ mass/thin AI content ممنوع.

---

## [ ] `P2-PBH-3` — CRO baseline and iteration

**مالک:** Product + Analytics  
**وابستگی:** analytics V3 stable  
**شرح:** baseline پس از انتشار V3 ثبت و بعد فقط بر اساس داده iteration انجام شود.

**KPIها:** hero CTA CTR، projects CTR، project engagement، qualification start/completion، contact conversion، non-brand landing clicks.

**پذیرش:** قبل از A/B test جدید baseline معتبر وجود داشته باشد و هر experiment یک hypothesis و success metric مشخص داشته باشد.

---

# Release / Completion Gate

V3 فقط زمانی Done است که:

- identity/title جدید در UI + SEO + schema یکسان باشد
- Hero شخصی با portrait approved یا یک asset-swap مستندشده آماده باشد
- Home materially کوتاه‌تر و دو CTA اصلی داشته باشد
- سه service + سه selected project مشخص باشند
- qualification second-stage باشد
- FA/EN و responsive/a11y سالم باشند
- quality gates واقعاً اجرا و نتیجه‌شان ثبت شده باشد؛ timeout/not-run هرگز green گزارش نشود
- PR شامل evidence و exact SHA باشد
- deployment فقط از pipeline موجود انجام شود
- live verification و rollback readiness ثبت شوند

## Historical note

تسک‌های قبلی مانند route-first navigation، metadata locale، sitemap manifest، design-token governance، A11y gate و qualification form قبلاً اجرا شده‌اند و باید به‌عنوان baseline حفظ شوند. V3 مجوز regress کردن آن‌ها نیست.