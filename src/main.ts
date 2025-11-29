import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { databaseProvider } from './infra/db/common/database.provider'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('Store Challenge')
    .setDescription('The Store Challenge API description')
    .setVersion('1.0')
    .addTag('store')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, documentFactory)

  await databaseProvider.initialize()

  await app.listen(process.env.PORT ?? 8080)
}

void bootstrap()
