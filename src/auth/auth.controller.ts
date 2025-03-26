import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dtos/SignUpDto';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from 'src/guards/local-guard';
import { JwtGuard } from 'src/guards/jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(PassportLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.signToken(req.user);
  }

  @Post('sign-up')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user;
  }
}
