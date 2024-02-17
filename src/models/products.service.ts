import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    // Convert ids to numbers
    const numericIds = ids.map((id) => parseInt(id, 10));

    // Use Prisma Client to find products by ids
    return this.prisma.product.findMany({
      where: {
        id: {
          in: numericIds,
        },
      },
    });
  }

  async createOrUpdate(productData: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id: parseInt(id), // Assuming 'id' is a numeric field in your Product model
      },
    });
  }
}
