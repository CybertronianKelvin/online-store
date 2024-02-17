import {
  Controller,
  Get,
  Render,
  Req,
  Redirect,
  Param,
  Body,
  Post,
  Res,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Import PrismaService
import { Product } from '@prisma/client'; // Import Product model from Prisma
import { UsersService } from 'src/models/users.service';
import { OrdersService } from '../models/orders.service';
import { ProductsService } from '../models/products.service';

@Controller('/cart')
export class CartController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('/')
  @Render('cart/index')
  async index(@Req() request) {
    let total = 0;
    let productsInCart: Product[] = null;
    const productsInSession = request.session.products;
    if (productsInSession) {
      const productIds = Object.keys(productsInSession).map(Number);
      productsInCart = await this.prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });
      total = this.sumPricesByQuantities(productsInCart, productsInSession);
    }
    const viewData: any = {};
    viewData.title = 'Cart - Online Store';
    viewData.subtitle = 'Shopping Cart';
    viewData.total = total;
    viewData.productsInCart = productsInCart;
    return {
      viewData,
    };
  }

  @Post('/add/:id')
  @Redirect('/cart')
  async add(@Param('id') id: number, @Body() body, @Req() request) {
    let productsInSession = request.session.products;
    if (!productsInSession) {
      productsInSession = {};
    }
    productsInSession[id] = body.quantity;
    request.session.products = productsInSession;
  }

  @Get('/delete')
  @Redirect('/cart/')
  async delete(@Req() request) {
    request.session.products = null;
  }

  sumPricesByQuantities(products: Product[], productsInSession): number {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total = total + products[i].price * productsInSession[products[i].id];
    }
    return total;
  }

  @Get('/purchase')
  async purchase(@Req() request, @Res() response) {
    if (!request.session.user) {
      return response.redirect('/auth/login');
    } else if (!request.session.products) {
      return response.redirect('/cart');
    } else {
      const userId = request.session.user.id;
      const user = await this.usersService.findOne(userId);

      const productsInSession = request.session.products;
      const productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession),
      );

      let total = 0;
      const items = [];

      for (const product of productsInCart) {
        const quantity = productsInSession[product.id];
        const item = {
          quantity,
          price: product.price,
          product: {
            connect: { id: product.id },
          },
        };
        items.push(item);
        total += product.price * quantity;
      }

      const newOrder = await this.ordersService.createOrUpdate({
        total,
        items: {
          createMany: {
            data: items,
          },
        },
        user: {
          connect: { id: userId },
        },
      });

      const newBalance = user.balance - total;
      await this.usersService.updateBalance(userId, newBalance);

      request.session.products = null;

      const viewData = {
        title: 'Purchase - Online Store',
        subtitle: 'Purchase Status',
        orderId: newOrder.id,
      };

      return response.render('cart/purchase', { viewData });
    }
  }
}
