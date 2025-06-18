// src/comprobantes/comprobantes.module.ts
import { Module } from '@nestjs/common';
import { ReceiptsService } from './services/receipts.service';
import { DatabaseModule } from '../core/database.module';
import { ReceiptsHandler } from './services/receipts.handler';

@Module({
  imports: [DatabaseModule],
//   controllers: [ReceiptsController],
  providers: [ReceiptsService, ReceiptsHandler],
})
export class ReceiptsModule {}
