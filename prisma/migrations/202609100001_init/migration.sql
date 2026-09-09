-- Neogenra production baseline migration for PostgreSQL.
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN','ADMIN','EDITOR','AUTHOR');
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT','REVIEW','PUBLISHED','ARCHIVED');
CREATE TYPE "AuditAction" AS ENUM ('CREATE','UPDATE','DELETE','PUBLISH','LOGIN','LOGOUT','PASSWORD_RESET','SETTINGS_CHANGE','ROLLBACK','MFA_ENABLE','MFA_DISABLE','MEDIA_UPLOAD');
CREATE TYPE "LeadStatus" AS ENUM ('NEW','CONTACTED','QUALIFIED','WON','LOST','SPAM');
CREATE TYPE "TemplateType" AS ENUM ('PAGE','SECTION','HEADER','FOOTER');
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT','REVIEW','PUBLISHED','ARCHIVED');

CREATE TABLE "User" (
 "id" TEXT NOT NULL, "email" TEXT NOT NULL, "name" TEXT, "passwordHash" TEXT, "role" "Role" NOT NULL DEFAULT 'EDITOR', "isActive" BOOLEAN NOT NULL DEFAULT true, "failedLoginCount" INTEGER NOT NULL DEFAULT 0, "lockedUntil" TIMESTAMP(3), "mfaEnabled" BOOLEAN NOT NULL DEFAULT false, "mfaSecretEnc" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Session" (
 "id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId","expiresAt");

CREATE TABLE "Page" (
 "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "content" JSONB NOT NULL, "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT', "seoTitle" TEXT, "seoDescription" TEXT, "canonicalUrl" TEXT, "noIndex" BOOLEAN NOT NULL DEFAULT false, "ogImage" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

CREATE TABLE "Project" (
 "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "client" TEXT, "category" TEXT, "excerpt" TEXT, "content" JSONB NOT NULL, "coverImage" TEXT, "gallery" JSONB, "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT', "featured" BOOLEAN NOT NULL DEFAULT false, "seoTitle" TEXT, "seoDescription" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

CREATE TABLE "Service" (
 "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "shortDescription" TEXT, "content" JSONB NOT NULL, "icon" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0, "published" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

CREATE TABLE "TeamMember" (
 "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL, "role" TEXT NOT NULL, "bio" TEXT, "image" TEXT, "socials" JSONB, "sortOrder" INTEGER NOT NULL DEFAULT 0, "published" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");

CREATE TABLE "Testimonial" (
 "id" TEXT NOT NULL, "name" TEXT NOT NULL, "company" TEXT, "quote" TEXT NOT NULL, "image" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0, "published" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Article" (
 "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "excerpt" TEXT, "content" JSONB NOT NULL, "coverImage" TEXT, "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT', "category" TEXT, "tags" JSONB, "authorId" TEXT, "publishedAt" TIMESTAMP(3), "seoTitle" TEXT, "seoDescription" TEXT, "noIndex" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status","publishedAt");
CREATE INDEX "Article_category_publishedAt_idx" ON "Article"("category","publishedAt");

CREATE TABLE "BuilderTemplate" (
 "id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "type" "TemplateType" NOT NULL DEFAULT 'SECTION', "description" TEXT, "content" JSONB NOT NULL, "isGlobal" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "BuilderTemplate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "BuilderTemplate_slug_key" ON "BuilderTemplate"("slug");

CREATE TABLE "NavigationItem" (
 "id" TEXT NOT NULL, "label" TEXT NOT NULL, "href" TEXT NOT NULL, "parentId" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0, "enabled" BOOLEAN NOT NULL DEFAULT true, "openInNewTab" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "NavigationItem_parentId_sortOrder_idx" ON "NavigationItem"("parentId","sortOrder");

CREATE TABLE "SiteSetting" (
 "id" TEXT NOT NULL, "key" TEXT NOT NULL, "value" JSONB NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

CREATE TABLE "MediaAsset" (
 "id" TEXT NOT NULL, "url" TEXT NOT NULL, "publicId" TEXT, "filename" TEXT NOT NULL, "mimeType" TEXT NOT NULL, "sizeBytes" INTEGER NOT NULL, "altText" TEXT, "width" INTEGER, "height" INTEGER, "folder" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MediaAsset_folder_createdAt_idx" ON "MediaAsset"("folder","createdAt");

CREATE TABLE "Lead" (
 "id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT, "phone" TEXT, "company" TEXT, "service" TEXT, "message" TEXT NOT NULL, "status" "LeadStatus" NOT NULL DEFAULT 'NEW', "source" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status","createdAt");

CREATE TABLE "RateLimitEvent" (
 "id" TEXT NOT NULL, "keyHash" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "RateLimitEvent_keyHash_createdAt_idx" ON "RateLimitEvent"("keyHash","createdAt");

CREATE TABLE "Redirect" (
 "id" TEXT NOT NULL, "fromPath" TEXT NOT NULL, "toPath" TEXT NOT NULL, "statusCode" INTEGER NOT NULL DEFAULT 301, "enabled" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Redirect_fromPath_key" ON "Redirect"("fromPath");

CREATE TABLE "Revision" (
 "id" TEXT NOT NULL, "entity" TEXT NOT NULL, "snapshot" JSONB NOT NULL, "version" INTEGER NOT NULL, "createdById" TEXT, "pageId" TEXT, "projectId" TEXT, "articleId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Revision_entity_createdAt_idx" ON "Revision"("entity","createdAt");
CREATE INDEX "Revision_pageId_version_idx" ON "Revision"("pageId","version");
CREATE INDEX "Revision_projectId_version_idx" ON "Revision"("projectId","version");
CREATE INDEX "Revision_articleId_version_idx" ON "Revision"("articleId","version");

CREATE TABLE "AuditLog" (
 "id" TEXT NOT NULL, "userId" TEXT, "action" "AuditAction" NOT NULL, "entity" TEXT, "entityId" TEXT, "ipHash" TEXT, "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId","createdAt");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavigationItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

