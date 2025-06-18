import { cleanDataIaJson } from '../helpers/cleanDataIaJson';
import { IaAnalizeQueryResponse, IAQueryResponse } from '../ia/ia';
import { ai } from '../ia/ia.service';
import {
  generatePromptForAnalysis,
  generatePromptForAnalysisUser,
  generatePromptForQuery,
} from '../ia/prompt';
import ExcelJS from 'exceljs';
import { ReceiptData } from '../interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiptsHandler {
  async generateQueryIa(message: string): Promise<{
    message: string;
    status: boolean;
    query: string | null;
  }> {
    // generar query
    const prompt = generatePromptForQuery();
    const respIa = await ai.createChat([
      { role: 'system', content: prompt },
      { role: 'user', content: message },
    ]);

    if (!respIa) {
      return {
        message: 'No existe data',
        status: false,
        query: null,
      };
    }

    const cleaned = cleanDataIaJson(respIa);
    const parsed = JSON.parse(cleaned ?? '{}') as IAQueryResponse;

    if (!parsed.status) {
      return {
        message: parsed.message,
        status: false,
        query: null,
      };
    }
    return {
      message: parsed.message,
      status: parsed.status,
      query: parsed.query,
    };
  }

  generateResponseByAnalizeQuery = async (
    message: string,
    queryDbMessage: string,
    queryDbQuery: string,
    resultString: string,
  ): Promise<{
    message: string;
    status: boolean;
  }> => {
    const promptAnalize = generatePromptForAnalysis();
    const contextMessage = generatePromptForAnalysisUser(
      message,
      queryDbMessage,
      queryDbQuery,
      resultString,
    );

    const response = await ai.createChat([
      { role: 'system', content: promptAnalize },
      { role: 'user', content: contextMessage },
    ]);

    if (!response) {
      return {
        message: 'No existe data',
        status: false,
      };
    }

    const cleanedAnalize = cleanDataIaJson(response);
    const parsedDataAnalize = JSON.parse(
      cleanedAnalize ?? '{}',
    ) as IaAnalizeQueryResponse;

    if (!parsedDataAnalize.status) {
      return {
        message: parsedDataAnalize.explanation,
        status: false,
      };
    }

    return {
      message: parsedDataAnalize.explanation,
      status: parsedDataAnalize.status,
    };
  };

  generateExcel = async (receipts: ReceiptData[]): Promise<string> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Recibos');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Empresa', key: 'companyId', width: 20 },
      { header: 'RUC Proveedor', key: 'supplierRuc', width: 20 },
      { header: 'Número Factura', key: 'invoiceNumber', width: 20 },
      { header: 'Monto', key: 'amount', width: 10 },
      { header: 'IGV', key: 'igv', width: 10 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Fecha', key: 'issueDate', width: 15 },
      { header: 'Tipo', key: 'documentType', width: 10 },
      { header: 'Estado', key: 'status', width: 15 },
    ];

    for (const receipt of receipts) {
      worksheet.addRow({
        ...receipt,
        issueDate: receipt.issueDate.toISOString().split('T')[0],
      });
    }
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `recibos-${Date.now()}.xlsx`;
    const outputPath = path.join(process.cwd(), 'uploads', filename);
    await fs.promises.writeFile(outputPath, new Uint8Array(buffer));

    return filename;
  };
  
}
