/*
  Warnings:

  - Changed the type of `documentType` on the `Receipt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('FACTURA', 'BOLETA', 'TICKET');

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "documentType",
ADD COLUMN     "documentType" "DocumentType" NOT NULL;
