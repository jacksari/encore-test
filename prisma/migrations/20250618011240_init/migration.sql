-- CreateTable
CREATE TABLE "Comprobante" (
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

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);
