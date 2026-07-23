/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CLIENT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken",
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STAFF';

-- DropEnum
DROP TYPE "Role";
