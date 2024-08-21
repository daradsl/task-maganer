import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;
}
