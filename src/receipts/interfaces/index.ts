export type ReceiptData = {
  id: string;
  amount: number;
  igv: number;
  total: number;
  status: string;
  issueDate: Date;
  documentType: string;
};

export interface IResponseFindAll {
  message: string;
  data: {
    items: ReceiptData[];
    total: number;
    page: number;
    perpage: number;
    totalPages: number;
  };
  status: boolean;
}

export interface IResponseApi {
  message: string;
  status: boolean;
}

export interface IResponseExportData {
  data: {
    url: string;
  };
  message: string;
  status: boolean;
}
