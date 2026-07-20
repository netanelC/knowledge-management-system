-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "s3Key" TEXT,
    "extractedText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);
