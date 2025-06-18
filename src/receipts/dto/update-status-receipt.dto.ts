
export enum StatusType {
  pending = 'pending',
  validated = 'validated',
  rejected = 'rejected',
  observed = 'observed'
}


export interface UpdateStatusReceiptDto {
  id: string;
  status: StatusType;
}
