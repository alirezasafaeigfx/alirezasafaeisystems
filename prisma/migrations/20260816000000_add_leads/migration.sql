-- Add the Lead table before the UTM content extension migration.
-- The older 20260618141730 snapshot also created Lead on fresh databases, so
-- this migration must be idempotent. Legacy production databases that do not
-- yet contain Lead still create it here after the overlapping snapshot is
-- structurally resolved as applied.
CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'qualification_form',
    "contactName" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "teamSize" TEXT NOT NULL,
    "currentStack" TEXT NOT NULL,
    "criticalRisk" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "budgetRange" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL,
    "notes" TEXT,
    "attachmentPath" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);