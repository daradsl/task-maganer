import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/database/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/common/decorators/logged-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUserDto } from './dto/logged-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getCurrentUser(@LoggedUser() loggedUser: LoggedUserDto): Promise<User> {
        return this.userService.getUserById(loggedUser.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
        return this.userService.getUserById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':email')
    async getUserByEmail(@Param('email') email: string): Promise<User | null> {
        return this.userService.getUserByEmail(email);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.userService.deleteUser(id);
    }
}
