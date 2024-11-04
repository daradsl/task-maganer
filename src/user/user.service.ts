import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ExecutionTimeInterceptor } from 'src/interceptor/execution-time.interceptor';
import * as faker from 'faker';
import { Address } from 'src/database/entities/address.entity';

@Injectable()
@UseInterceptors(ExecutionTimeInterceptor)
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) { }

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password, birthDate, googleId } = createUserDto;
        const user = this.userRepository.create({ name, email, password, birthDate, googleId });
        return this.userRepository.save(user);
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email: email } });
    }

    async getUserByEmailAndGoogleId(email: string, googleId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email, googleId } });
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

    async bulkInsertUsers(): Promise<void> {
        const users = [];
        const addresses = [];
        const batchSize = 10000;

        for (let i = 0; i < 1000000; i++) {
            const user = new User();
            user.name = faker.name.findName();
            user.email = `user_${i}_${faker.internet.email()}`;
            user.password = await bcrypt.hash(faker.internet.password(), 10);
            user.birthDate = faker.date.past(50, new Date(2000, 0, 1));

            const address = new Address();
            address.complement = faker.address.secondaryAddress();
            address.city = faker.address.city();
            address.state = faker.address.state();
            address.zipCode = faker.address.zipCode();

            address.user = user;

            users.push(user);
            addresses.push(address);

            if (users.length === batchSize) {
                await this.userRepository.save(users);
                await this.addressRepository.save(addresses);
                console.log(`Inserido lote ${(i / batchSize) + 1}`);
                users.length = 0;
                addresses.length = 0;
            }
        }

        if (users.length > 0) {
            await this.userRepository.save(users);
            await this.addressRepository.save(addresses);
            console.log('Inserido último lote');
        }
    }
}
