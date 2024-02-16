import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client'; // Import Prisma type
import { PrismaService } from '../prisma.service';

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
}
