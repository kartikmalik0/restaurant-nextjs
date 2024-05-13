/*
  Warnings:

  - You are about to drop the column `isOpen` on the `IsResturantOpen` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "shopStatus" AS ENUM ('OPEN', 'CLOSE');

-- AlterTable
ALTER TABLE "IsResturantOpen" DROP COLUMN "isOpen",
ADD COLUMN     "shopStatus" "shopStatus" NOT NULL DEFAULT 'CLOSE';
