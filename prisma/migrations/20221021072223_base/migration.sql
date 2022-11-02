/*
  Warnings:

  - You are about to drop the column `locationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_locationId_fkey";

-- DropIndex
DROP INDEX "User_locationId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationId";

-- DropTable
DROP TABLE "Location";
