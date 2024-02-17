import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { PrismaService } from './prisma.service';
import { ProductsService } from './models/products.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './models/users.service';

@Global()
@Module({
  imports: [AdminModule, AuthModule],
  controllers: [AppController, ProductsController],
  providers: [PrismaService, ProductsService, UsersService],
  exports: [PrismaService, ProductsService, UsersService],
})
export class AppModule {}
