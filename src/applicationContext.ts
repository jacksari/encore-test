import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReceiptsService } from './receipts/services/receipts.service';
import { ReceiptsModule } from './receipts/receipts.module';
import { ReceiptsHandler } from './receipts/services/receipts.handler';

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<{
  receiptsService: ReceiptsService;
  receiptsHandler: ReceiptsHandler;
}> = NestFactory.createApplicationContext(AppModule).then((app) => {
  return {
    // catsService: app.select(CatsModule).get(CatsService, { strict: true }),
    receiptsService: app
      .select(ReceiptsModule)
      .get(ReceiptsService, { strict: true }),
    receiptsHandler: app
      .select(ReceiptsModule)
      .get(ReceiptsHandler, { strict: true }),
  };
});

export default applicationContext;
