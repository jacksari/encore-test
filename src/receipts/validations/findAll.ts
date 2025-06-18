import { z } from 'zod';

export const GetReceiptsQuery = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  documentType: z.enum(['FACTURA', 'BOLETA']).optional(),
  status: z.enum(['pending', 'validated', 'rejected']).optional(),
});



// export type GetReceiptsQueryType = z.infer<typeof GetReceiptsQuery>;