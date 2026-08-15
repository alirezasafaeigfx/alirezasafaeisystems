-- Add lifecycle fields without changing existing portfolio visibility.
ALTER TABLE "Project" ADD COLUMN "contentType" TEXT NOT NULL DEFAULT 'portfolio';
ALTER TABLE "Project" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "Project_contentType_published_order_idx"
ON "Project"("contentType", "published", "order");
