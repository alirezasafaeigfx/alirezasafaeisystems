ALTER TABLE "BlogPost" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "excerptEn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "contentEn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'engineering';
ALTER TABLE "BlogPost" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BlogPost" ADD COLUMN "publishedAt" DATETIME;
ALTER TABLE "BlogPost" ADD COLUMN "lastReviewedAt" DATETIME;
ALTER TABLE "BlogPost" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "seoDescription" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "seoTitleEn" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "seoDescriptionEn" TEXT;

CREATE INDEX "BlogPost_published_featured_publishedAt_idx" ON "BlogPost"("published", "featured", "publishedAt");
CREATE INDEX "BlogPost_category_published_idx" ON "BlogPost"("category", "published");
