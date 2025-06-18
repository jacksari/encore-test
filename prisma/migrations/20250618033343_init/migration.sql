/*
  Warnings:

  - You are about to drop the `Comprobante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Comprobante";

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "supplierRuc" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "igv" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "documentType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);
