import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
