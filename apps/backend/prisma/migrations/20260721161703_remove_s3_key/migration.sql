/*
  Warnings:

  - You are about to drop the column `s3Key` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "s3Key";
