-- CreateEnum
CREATE TYPE "type" AS ENUM ('M', 'T', 'F');

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "type" "type" NOT NULL DEFAULT 'M';
