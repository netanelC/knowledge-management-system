/*
  Warnings:

  - You are about to drop the column `s3Key` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `size` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('TEXT', 'IMAGE');

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "s3Key",
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" "AssetType" NOT NULL DEFAULT 'TEXT';
