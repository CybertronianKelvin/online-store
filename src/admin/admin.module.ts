import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminProductsController } from './admin.products.controller';
import { ProductsService } from '../models/products.service';
import { AppModule } from '../app.module';
@Module({
  controllers: [AdminController, AdminProductsController],
})
export class AdminModule {}
