import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminProductsController } from './admin.products.controller';
import { PrismaService } from '../prisma.service';
import { ProductsService } from '../models/products.service';
@Module({
  controllers: [AdminController, AdminProductsController],
})
export class AdminModule {}
