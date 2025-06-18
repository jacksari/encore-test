import { prisma } from '../core/prisma.service';
import {
  CreateReceiptDto,
  DocumentType,
} from '../receipts/dto/create-receipt.dto';
import { GetReceiptsQueryDto } from '../receipts/dto/get-receipst.dto';
import {
  StatusType,
  UpdateStatusReceiptDto,
} from '../receipts/dto/update-status-receipt.dto';
import { ReceiptsService } from '../receipts/services/receipts.service';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('../core/prisma.service', () => ({
  prisma: {
    receipt: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../applicationContext', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../receipts/helpers/paginate', () => ({
  paginate: jest.fn((items, total, page = 1, perpage = 10) => ({
    items,
    total,
    page,
    perpage,
    totalPages: Math.ceil(total / perpage),
  })),
}));

describe('ReceiptsService', () => {
  let receiptsService: ReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptsService],
    }).compile();

    receiptsService = module.get<ReceiptsService>(ReceiptsService);
  });

  it('debería devolver recibos con filtros y paginación', async () => {
    const dto: GetReceiptsQueryDto = {
      page: 1,
      perpage: 10,
      fromDate: '2025-06-01',
      toDate: '2025-06-30',
      documentType: DocumentType.BOLETA,
      status: StatusType.validated,
    };

    const mockItems = [
      {
        id: '2e3b9efc-00ca-43bd-aa85-65f7480d370d',
        issueDate: new Date(),
        documentType: 'BOLETA',
        status: 'validated',
        amount: 100,
      },
    ];

    const mockTotal = 1;

    (prisma.receipt.findMany as jest.Mock).mockResolvedValue(mockItems);
    (prisma.receipt.count as jest.Mock).mockResolvedValue(mockTotal);

    const result = await receiptsService.findAll(dto);

    expect(prisma.receipt.findMany).toHaveBeenCalledWith({
      where: {
        issueDate: {
          gte: new Date(dto.fromDate as string),
          lte: new Date(dto.toDate as string),
        },
        documentType: dto.documentType,
        status: dto.status,
      },
      skip: 0,
      take: 10,
      orderBy: { issueDate: 'desc' },
    });

    expect(prisma.receipt.count).toHaveBeenCalledWith({
      where: {
        issueDate: {
          gte: new Date(dto.fromDate as string),
          lte: new Date(dto.toDate as string),
        },
        documentType: dto.documentType,
        status: dto.status,
      },
    });

    expect(result).toEqual({
      items: mockItems,
      total: mockTotal,
      page: 1,
      perpage: 10,
      totalPages: 1,
    });
  });
});

describe('ReceiptsService - store', () => {
  let receiptsService: ReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptsService],
    }).compile();

    receiptsService = module.get<ReceiptsService>(ReceiptsService);
  });

  it('debería crear un recibo con IGV y total calculado', async () => {
    const input = {
      companyId: 'EMP001',
      supplierRuc: '20123456789',
      invoiceNumber: 'F001-129',
      amount: 100,
      issueDate: '2025-06-18',
      documentType: DocumentType.FACTURA,
    } as CreateReceiptDto;

    const expectedResult = {
      message: 'recibo creado',
      status: true,
    };

    (prisma.receipt.create as jest.Mock).mockResolvedValue(expectedResult);

    const result = await receiptsService.store(input);

    expect(prisma.receipt.create).toHaveBeenCalledWith({
      data: {
        ...input,
        igv: 18,
        total: 118,
        issueDate: new Date(input.issueDate),
        documentType: input.documentType,
      },
    });

    expect(result).toEqual(expectedResult);
  });
});

describe('ReceiptsService - updateStatus', () => {
  let receiptsService: ReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptsService],
    }).compile();

    receiptsService = module.get<ReceiptsService>(ReceiptsService);
  });

  it('debería actualizar el estado del recibo', async () => {
    const dto = {
      id: '2e3b9efc-00ca-43bd-aa85-65f7480d370d',
      status: 'validated',
    } as UpdateStatusReceiptDto;

    const updatedReceipt = {
      id: '2e3b9efc-00ca-43bd-aa85-65f7480d370d',
      status: 'validated',
      invoiceNumber: 'F001-128',
    };

    (prisma.receipt.update as jest.Mock).mockResolvedValue(updatedReceipt);

    const result = await receiptsService.updateStatus(dto);

    expect(prisma.receipt.update).toHaveBeenCalledWith({
      where: { id: dto.id },
      data: { status: dto.status },
    });

    expect(result).toEqual(updatedReceipt);
  });
});
