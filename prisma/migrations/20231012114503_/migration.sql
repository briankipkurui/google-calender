/*
  Warnings:

  - You are about to drop the column `enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `refreshToken` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_userId_fkey";

-- DropIndex
DROP INDEX "users_email_id_phoneNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "enabled",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "password",
DROP COLUMN "phoneNumber",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "refreshToken" SET NOT NULL;

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "userRole";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_id_key" ON "users"("email", "id");
