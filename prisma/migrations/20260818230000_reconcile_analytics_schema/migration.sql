-- Reconcile the historical analytics snapshot with the current Prisma schema.
-- This migration also repairs indexes that may be absent when the overlapping
-- 20260618141730 snapshot (or later structurally-present migrations) is safely
-- resolved as applied on a pre-migrations production database.

-- Ensure the two analytics tables exist when the malformed historical snapshot
-- was resolved instead of executed on a legacy database.
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "site" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "properties" TEXT NOT NULL DEFAULT '{}',
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FunnelConversion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "entryPoint" TEXT NOT NULL,
    "visitedToolbox" BOOLEAN NOT NULL DEFAULT false,
    "visitedPortfolio" BOOLEAN NOT NULL DEFAULT false,
    "visitedAudit" BOOLEAN NOT NULL DEFAULT false,
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "conversionValue" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- SQLite requires a table rebuild to relax historical NOT NULL constraints and
-- add the internal analytics fields represented by the current Prisma model.
CREATE TABLE "new_AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "site" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "properties" TEXT NOT NULL DEFAULT '{}',
    "sessionId" TEXT,
    "userId" TEXT,
    "timestamp" DATETIME,
    "ip" TEXT,
    "userAgent" TEXT,
    "name" TEXT,
    "category" TEXT,
    "path" TEXT,
    "locale" TEXT,
    "variant" TEXT,
    "value" REAL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_AnalyticsEvent" (
    "id",
    "site",
    "event",
    "properties",
    "sessionId",
    "userId",
    "timestamp",
    "ip",
    "userAgent",
    "createdAt"
)
SELECT
    "id",
    "site",
    "event",
    "properties",
    "sessionId",
    "userId",
    "timestamp",
    "ip",
    "userAgent",
    "createdAt"
FROM "AnalyticsEvent";

DROP TABLE "AnalyticsEvent";
ALTER TABLE "new_AnalyticsEvent" RENAME TO "AnalyticsEvent";

-- Current Prisma indexes.
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_site_event_idx" ON "AnalyticsEvent"("site", "event");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_timestamp_idx" ON "AnalyticsEvent"("timestamp");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_name_idx" ON "AnalyticsEvent"("name");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_category_idx" ON "AnalyticsEvent"("category");

CREATE UNIQUE INDEX IF NOT EXISTS "FunnelConversion_sessionId_key" ON "FunnelConversion"("sessionId");
CREATE INDEX IF NOT EXISTS "FunnelConversion_sessionId_idx" ON "FunnelConversion"("sessionId");
CREATE INDEX IF NOT EXISTS "FunnelConversion_entryPoint_idx" ON "FunnelConversion"("entryPoint");
CREATE INDEX IF NOT EXISTS "FunnelConversion_converted_idx" ON "FunnelConversion"("converted");

CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "DiscoverItem_slug_key" ON "DiscoverItem"("slug");
CREATE INDEX IF NOT EXISTS "DiscoverItem_published_featured_order_idx" ON "DiscoverItem"("published", "featured", "order");
CREATE INDEX IF NOT EXISTS "DiscoverItem_category_published_idx" ON "DiscoverItem"("category", "published");

-- This historical index is not represented by the current Prisma schema.
DROP INDEX IF EXISTS "Project_contentType_published_order_idx";
