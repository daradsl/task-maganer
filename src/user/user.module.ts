import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { LoggerModule } from 'src/logger/custom-logger.module';
import { Address } from 'src/database/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), LoggerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
