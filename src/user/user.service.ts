import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password, birthDate } = createUserDto;
        const user = this.userRepository.create({ name, email, password, birthDate });
        return this.userRepository.save(user);
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.getUserById(id);
        Object.assign(user, updateUserDto);
        if (updateUserDto.password) {
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userRepository.save(user);
    }

    async deleteUser(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
