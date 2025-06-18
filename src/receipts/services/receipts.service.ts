import { Injectable } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { CreateReceiptDto } from '../dto/create-receipt.dto';
import { ReceiptData } from '../interfaces';
import { GetReceiptsQueryDto } from '../dto/get-receipst.dto';
import { UpdateStatusReceiptDto } from '../dto/update-status-receipt.dto';
import { paginate } from '../helpers/paginate';
import { convertBigInts } from '../helpers/convertBigint';
import { prisma } from '../../core/prisma.service';
import applicationContext from '../../applicationContext';
import { AnalizeDataReceiptDto } from '../dto/analize-data-receipt.dto';

@Injectable()
export class ReceiptsService {
  async store(data: CreateReceiptDto) {
    try {
      const igv = +(data.amount * 0.18).toFixed(2);
      const total = +(data.amount + igv).toFixed(2);

      await prisma.receipt.create({
        data: {
          companyId: data.companyId,
          supplierRuc: data.supplierRuc,
          invoiceNumber: data.invoiceNumber,
          amount: data.amount,
          igv,
          total,
          issueDate: new Date(data.issueDate),
          documentType: data.documentType as DocumentType,
        },
      });

      return { message: 'recibo creado', status: true };
    } catch (error) {
      return { message: 'comunicarse con soporte', status: false };
    }
  }

  async findAll(dto: GetReceiptsQueryDto): Promise<{
    items: ReceiptData[];
    total: number;
    page: number;
    perpage: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      perpage = 10,
      fromDate,
      toDate,
      documentType,
      status,
    } = dto;

    const where: any = {};

    if (fromDate && toDate) {
      where.issueDate = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }

    if (documentType) {
      where.documentType = documentType;
    }

    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip: (page - 1) * perpage,
        take: perpage,
        orderBy: { issueDate: 'desc' },
      }),
      prisma.receipt.count({ where }),
    ]);

    return paginate(items, total);
  }

  async updateStatus(dto: UpdateStatusReceiptDto) {
    const { id, status } = dto;
    return await prisma.receipt.update({
      where: { id },
      data: { status },
    });
  }

  async analizeData(dto: AnalizeDataReceiptDto): Promise<{
    message: string;
    status: boolean;
  }> {
    const { message } = dto;
    const { receiptsHandler } = await applicationContext;

    // generar query
    const queryDb = await receiptsHandler.generateQueryIa(message);
    if (!queryDb.status || !queryDb.query) {
      return {
        message: queryDb.message,
        status: false,
      };
    }

    // ejecutar query
    const result = await prisma.$queryRawUnsafe(queryDb.query);

    // analizar data
    const analizeData = await receiptsHandler.generateResponseByAnalizeQuery(
      message,
      queryDb.message,
      queryDb.query,
      JSON.stringify(convertBigInts(result)),
    );
    if (!analizeData.status) {
      return {
        message: analizeData.message,
        status: false,
      };
    }

    // retornar respuesta
    return {
      message: analizeData.message,
      status: analizeData.status,
    };
  }
}
