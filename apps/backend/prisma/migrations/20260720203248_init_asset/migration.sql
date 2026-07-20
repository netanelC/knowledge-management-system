/*
  Warnings:

  - You are about to drop the column `extractedText` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "extractedText",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "AssetType";
