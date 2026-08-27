# Discover Image Upload Implementation Plan

**Goal:** Add secure, admin-only Discover image upload backed by persistent server storage and served through a protected public media route.

**Architecture:** Reuse the existing admin session and rate-limit helpers. Resolve storage from `DISCOVER_UPLOAD_DIR` when configured, otherwise derive it from the directory containing a SQLite `DATABASE_URL`; never use `public/`, `.next/`, or a release directory. Process uploads with Sharp into immutable WebP files and store only the returned `/media/discover/<safe-name>.webp` URL in the existing `imageUrl` field.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vitest, React Testing Library, Prisma SQLite/PostgreSQL compatibility, Sharp.

## Global Constraints

- Accept only `image/jpeg`, `image/png`, and `image/webp`.
- Reject files larger than 8 MiB and reject SVG or non-image content.
- Do not trust client filenames; generate cryptographically random names.
- Reuse current admin authentication; unauthenticated upload returns 401/403.
- Preserve manual image URL entry and existing Discover schema.
- Do not use GitHub, external image hosting, migrations, media manager, or garbage collection.
- Do not write uploads into `public/`, `.next/`, or build/release directories.
- Do not perform git commands.

---

### Task 1: Storage and image-processing helpers

**Files:**
- Create: `src/lib/discover-upload.ts`
- Test: `src/__tests__/lib/discover-upload.test.ts`
- Modify: `.env.example`

- [ ] Write failing tests for storage resolution, safe generated names, MIME/size validation, Sharp WebP processing, and path containment.
- [ ] Run `pnpm exec vitest run src/__tests__/lib/discover-upload.test.ts` and confirm feature-specific failures.
- [ ] Implement typed constants and helpers: `MAX_DISCOVER_UPLOAD_BYTES`, `resolveDiscoverUploadDir()`, `validateDiscoverUpload()`, `processDiscoverUpload()`, and `isSafeDiscoverMediaFilename()`.
- [ ] Resolve `DISCOVER_UPLOAD_DIR` first; otherwise resolve only SQLite `DATABASE_URL=file:<path>` beside the database; reject ambiguous PostgreSQL configuration without an explicit upload directory.
- [ ] Use `randomBytes`/UUID-based filename, Sharp `autoOrient`, width 1600 without enlargement, WebP quality 82, and no metadata preservation.
- [ ] Run the focused test until green.

### Task 2: Admin upload API and public media route

**Files:**
- Create: `src/app/api/admin/discover/upload/route.ts`
- Create: `src/app/media/discover/[filename]/route.ts`
- Test: `src/__tests__/api/admin-discover-upload.integration.test.ts`

- [ ] Write failing tests for unauthenticated rejection, unsupported type rejection, oversize rejection, successful WebP upload, safe filename response, and media GET 200/404/path traversal rejection.
- [ ] Run the focused API test and confirm expected failures.
- [ ] Implement multipart parsing with the existing `enforceAdminAccess`, `checkRateLimit`, request IDs, common headers, and sanitized client errors.
- [ ] Persist processed bytes beneath the resolved Discover upload directory and return `{ url }` with the generated media URL.
- [ ] Implement the public route with a single filename segment, resolved-path containment check, correct `Content-Type`, `nosniff`, immutable cache headers, and 404 for missing/unsafe files.
- [ ] Run focused API tests until green.

### Task 3: Admin UI integration

**Files:**
- Modify: `src/components/admin/discover-manager.tsx`
- Test: `src/__tests__/components/discover-manager.test.tsx`

- [ ] Write failing component tests for file selection, multipart request, loading state, automatic URL population, preview, upload error, and Save disabled while uploading.
- [ ] Run the focused component test and confirm expected failures.
- [ ] Add an accessible file input accepting JPG/JPEG/PNG/WEBP, upload state, Persian error message, preview, and preserve manual URL editing.
- [ ] Disable Save during upload and support both create and edit because both use the same form.
- [ ] Run focused component tests until green.

### Task 4: Full verification and operational handoff

**Files:**
- No additional source files unless verification exposes a scoped defect.

- [ ] Run `pnpm type-check`.
- [ ] Run `pnpm lint` and record whether any pre-existing unrelated violations remain.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Exercise unauthenticated, invalid MIME, oversize, valid JPG, media GET, and storage-location checks against the running app.
- [ ] Inspect Docker/systemd deployment configuration and determine whether current production storage is persistent before any restart.
- [ ] If deployment is authorized and reachable, restart only the required service, then verify the public `/discover` journey, image URL, and persistence after restart.
- [ ] If production access is unavailable from `LOCAL_PC`, report the exact blocker and do not claim `IRAN_PROD_SERVER` verification.

## Rollback

Restore the timestamped backup at `.backups/discover-upload-20260821-130715`, remove only newly created source files if needed, and restart the previously running service using the existing operational procedure. Uploaded media files are additive and are not deleted automatically.

## Execution Note

This plan is intentionally uncommitted because the requested execution explicitly forbids all git operations.
