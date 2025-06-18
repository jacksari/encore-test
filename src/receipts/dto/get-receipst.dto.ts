import { Min, Max } from 'encore.dev/validate';
import { DocumentType } from './create-receipt.dto';
import { StatusType } from './update-status-receipt.dto';

export interface GetReceiptsQueryDto {
  page?: number & Min<1>;
  perpage?: number & Min<1> & Max<100>;
  fromDate?: string;
  toDate?: string;
  documentType?: DocumentType;
  status?: StatusType;
}
