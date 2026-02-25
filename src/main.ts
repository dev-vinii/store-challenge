import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { databaseProvider } from './infra/db/common/database.provider';
import { LoggingInterceptor } from './presentation/common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Store Challenge')
    .setDescription('The Store Challenge API description')
    .setVersion('1.0')
    .addTag('store')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);

  await databaseProvider.initialize();

  const port = process.env.PORT ?? 8080;

  await app.listen(port);

  logger.log(`Application is running on: ${port}`);
}

void bootstrap();
