import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword } from 'src/utils/hash.utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data });
  }

  async validateUserCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await comparePassword(user.password, password))) {
      return {
        userId: user.user_id,
        email: user.email,
      };
    }
    return null;
  }
}
