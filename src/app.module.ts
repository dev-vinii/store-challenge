import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './infra/cache/cache.module';
import { DatabaseModule } from './infra/db/database.module';
import { QueueModule } from './infra/queue/queue.module';
import { SearchModule } from './infra/search/search.module';
import { CategoryModule } from './presentation/features/categories/categories.module';
import { ProductModule } from './presentation/features/products/products.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    SearchModule,
    QueueModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
