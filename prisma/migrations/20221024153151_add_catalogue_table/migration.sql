/*
  Warnings:

  - The values [REJECTED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `serviceId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[catItemId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senderId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catItemId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('HOME', 'INSHOP', 'BOTH');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('REQUESTED', 'CANCELED', 'ACCPETED', 'FULFILLED');
ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'ACCPETED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- DropIndex
DROP INDEX "Request_serviceId_key";

-- DropIndex
DROP INDEX "Request_userId_key";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "serviceId",
DROP COLUMN "userId",
ADD COLUMN     "catItemId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL,
ADD COLUMN     "serviceType" "ServiceType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "services" "ServiceType" NOT NULL DEFAULT 'INSHOP';

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "CatalogueItem" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemDesc" TEXT NOT NULL,
    "itemCost" DECIMAL(65,30) NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "CatalogueItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CatalogueItem_providerId_key" ON "CatalogueItem"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_catItemId_key" ON "Request"("catItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_senderId_key" ON "Request"("senderId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_catItemId_fkey" FOREIGN KEY ("catItemId") REFERENCES "CatalogueItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogueItem" ADD CONSTRAINT "CatalogueItem_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
