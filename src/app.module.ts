import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/database/entities/**/*.js'],
      migrations: ['dist/database/migrations/**/*.js'],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/database/entities',
      },
    } as TypeOrmModuleOptions),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
