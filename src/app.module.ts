import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { PrismaService } from './prisma.service';
import { ProductsService } from './models/products.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [AppController, ProductsController],
  providers: [PrismaService, ProductsService],
  exports: [ProductsService],
})
export class AppModule {}
