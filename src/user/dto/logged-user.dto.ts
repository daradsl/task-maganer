import { IsEmail, IsUUID } from 'class-validator';

export class LoggedUserDto {
    @IsUUID()
    id: string;

    @IsEmail()
    email: string;
}
