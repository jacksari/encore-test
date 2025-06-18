import { api } from 'encore.dev/api';
import * as path from 'path';
import { readFile } from 'fs/promises';
import * as fs from 'fs';
import { APICallMeta, currentRequest } from 'encore.dev';

export const downloadFile = api.raw(
  {
    method: 'GET',
    path: '/uploads/:filename',
    expose: true,
  },
  async (req, resp) => {
    const { filename } = (currentRequest() as APICallMeta).pathParams;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('Archivo no encontrado');
      }

      const fileBuffer = await readFile(filePath);

      resp.end(fileBuffer);
    } catch (err) {
      resp.writeHead(500);
      resp.end((err as Error).message);
    }
  },
);
