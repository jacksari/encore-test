import { Max, Min } from "encore.dev/validate";

export enum DocumentType {
  FACTURA = 'FACTURA',
  BOLETA = 'BOLETA',
  TICKET = 'TICKET',
}

export interface CreateReceiptDto {
  companyId: string;

  supplierRuc: string;

  invoiceNumber: string;

  amount: number & (Min<3> & Max<1000000>);

  issueDate: string;

  documentType: DocumentType;
}
