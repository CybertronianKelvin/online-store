import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { PrismaService } from './prisma.service';
import { ProductsService } from './models/products.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './models/users.service';
import { CartModule } from './cart/cart.module';
import { OrdersService } from './models/orders.service';
import { AccountModule } from './account/account.module';

@Global()
@Module({
  imports: [AdminModule, AuthModule, CartModule, AccountModule],
  controllers: [AppController, ProductsController],
  providers: [PrismaService, ProductsService, UsersService, OrdersService],
  exports: [PrismaService, ProductsService, UsersService, OrdersService],
})
export class AppModule {}
