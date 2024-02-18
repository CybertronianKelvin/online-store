import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(order: any): Promise<any> {
    const { items, ...orderData } = order; // Destructure 'items' from the order object
    // Create the order without 'items'
    const createdOrder = await this.prisma.order.create({
      data: orderData,
    });

    // Create 'items' associated with the order
    if (items && items.length > 0) {
      for (const item of items) {
        await this.prisma.item.create({
          data: {
            ...item,
            order: {
              // Associate the item with the order
              connect: {
                id: createdOrder.id, // Use the ID of the created order
              },
            },
            productId: item.productId,
          },
        });
      }
    }

    return createdOrder;
  }

  async findByUserId(id: number): Promise<any> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: id, // Assuming `userId` is the foreign key in the Order model referencing the User ID
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders;
  }
}
