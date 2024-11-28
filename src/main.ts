import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from './logger/custom-logger.service';
import { tracingService } from './monitor/tracing.service';

async function bootstrap() {
  tracingService.start();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = process.env.PORT || 3000;

  app.useLogger(app.get(CustomLoggerService));

  const config = new DocumentBuilder()
    .setTitle('Task Time Manager')
    .setDescription('The Task Time Manager API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);
  app.get(CustomLoggerService).log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
