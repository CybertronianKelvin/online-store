import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { PrismaService } from './prisma.service';
import { ProductsService } from './models/products.service';

@Module({
  controllers: [AppController, ProductsController],
  providers: [ProductsService, PrismaService],
})
export class AppModule {}
