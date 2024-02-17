import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // @todo types meeds sorting here
  async createOrUpdate(order: any): Promise<any> {
    const { items, ...orderData } = order; // Destructure 'items' from the order object

    // Upsert the order without 'items'
    const updatedOrder = await this.prisma.order.upsert({
      where: {
        id: order.id,
      },
      update: orderData,
      create: orderData,
    });

    // Update or create 'items' associated with the order
    if (items && items.length > 0) {
      for (const item of items) {
        await this.prisma.item.upsert({
          where: {
            id: item.id, // Assuming 'id' is the primary key of the item
          },
          update: item,
          create: item,
        });
      }
    }

    return updatedOrder;
  }
}
