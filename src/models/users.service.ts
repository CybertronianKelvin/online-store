import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Assuming you have a PrismaService
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(user: any): Promise<any> {
    const hash = await bcrypt.hash(user.password, 10);
    return this.prisma.user.create({
      data: {
        name: user.name,
        password: hash,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    });
  }

  async login(email: string, password: string): Promise<User | null> {
    // Find the user based on the email
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return user;
      }
    }

    return null;
  }
}
