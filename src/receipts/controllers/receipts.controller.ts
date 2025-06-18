import { api, APIError } from 'encore.dev/api';
import applicationContext from '../../applicationContext';
import {
  IResponseApi,
  IResponseExportData,
  IResponseFindAll,
} from '../interfaces';
import { GetReceiptsQueryDto } from '../dto/get-receipst.dto';
import { UpdateStatusReceiptDto } from '../dto/update-status-receipt.dto';
import { CreateReceiptDto } from '../dto/create-receipt.dto';
import { AnalizeDataReceiptDto } from '../dto/analize-data-receipt.dto';

export const findAll = api(
  { expose: true, auth: true, method: 'GET', path: '/receipts' },
  async (dto: GetReceiptsQueryDto): Promise<IResponseFindAll> => {
    const { receiptsService } = await applicationContext;
    const data = await receiptsService.findAll(dto);
    return { message: 'lista de recibos', status: true, data };
  },
);

export const createReceipt = api(
  {
    expose: true,
    auth: true,
    method: 'POST',
    path: '/receipts',
  },
  async (dto: CreateReceiptDto): Promise<IResponseApi> => {
    const { receiptsService } = await applicationContext;
    return receiptsService.store(dto);
  },
);

export const generateFileCsv = api(
  {
    method: 'GET',
    path: '/receipts/export',
    expose: true,
    auth: true,
  },
  async (query: GetReceiptsQueryDto): Promise<IResponseExportData> => {
    const { receiptsService, receiptsHandler } = await applicationContext;

    const { items } = await receiptsService.findAll(query);
    const url = await receiptsHandler.generateExcel(items);

    return {
      data: {
        url: `${process.env.URL_BACKEND}/uploads/${url}`,
      },
      message: 'Datos exportados',
      status: true,
    };
  },
);

export const updateReceiptStatus = api(
  {
    method: 'PUT',
    path: '/receipts/:id/status',
    expose: true,
    auth: true,
  },
  async (dto: UpdateStatusReceiptDto): Promise<IResponseApi> => {
    const { receiptsService } = await applicationContext;

    await receiptsService.updateStatus(dto);

    return { message: 'Estado actualizado correctamente', status: true };
  },
);

export const analizeData = api(
  {
    method: 'POST',
    path: '/receipts/ia',
    expose: true,
    auth: true,
  },
  async (dto: AnalizeDataReceiptDto): Promise<IResponseApi> => {
    const { receiptsService } = await applicationContext;
    return await receiptsService.analizeData(dto);
  },
);
