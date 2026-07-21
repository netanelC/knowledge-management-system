-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('DOCUMENT', 'IMAGE');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "type" "AssetType" NOT NULL DEFAULT 'DOCUMENT';
