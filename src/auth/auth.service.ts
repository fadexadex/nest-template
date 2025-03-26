import { Injectable, ForbiddenException } from '@nestjs/common';
import { SignUpDto } from './dtos/SignUpDto';
import { hashPassword } from 'src/utils/hash.utils';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PayloadDto } from './dtos/PayloadDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(signUpDto: SignUpDto) {
    try {
      signUpDto.password = await hashPassword(signUpDto.password);

      const user = await this.usersService.createUser(signUpDto);
      return this.signToken({ userId: user.user_id, email: user.email });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(user: PayloadDto) {
    const payload = {
      sub: user.userId,
      email: user.email,
    };

    const secret = this.config.get<string>('JWT_SECRET');

    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: '1h',
        secret,
      }),
    };
  }
}
