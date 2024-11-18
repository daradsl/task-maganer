import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerService } from './logger/custom-logger.service';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import { LoggingMiddleware } from './middleware/loggin.middleware';
import { ExecutionTimeInterceptor } from './interceptor/execution-time.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

dotenv.config();

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customAttributeKeys: {
          req: 'request',
          res: 'response',
          err: 'error',
        },
        customLogLevel: (req: IncomingMessage, res: ServerResponse<IncomingMessage>, error?: Error | undefined) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || error) {
            return 'error';
          }
          return 'info';
        },
        level: 'info',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'SYS:dd/MM/yyyy HH:mm:ss',
              },
              level: 'info',
            },
            // {
            //   target: 'pino/file',
            //   options: {
            //     destination: './logger/app.log',
            //     translateTime: 'SYS:dd/MM/yyyy HH:mm:ss',
            //     colorize: true,
            //     levelFirst: true,
            //     sync: false,
            //   },
            //   level: 'info',
            // },
          ],
        },
      },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/database/entities/**/*.js'],
      migrations: ['dist/database/migrations/**/*.js'],
      synchronize: false,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/database/entities',
      },
      extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    } as TypeOrmModuleOptions),
    UserModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLoggerService, {
    provide: APP_INTERCEPTOR,
    useClass: ExecutionTimeInterceptor,
  },],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}