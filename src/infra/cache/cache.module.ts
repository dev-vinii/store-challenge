import { Global, Module } from '@nestjs/common';
import { CacheProvider, cacheProvider } from './cache.provider';

@Global()
@Module({
  providers: [
    {
      provide: CacheProvider,
      useValue: cacheProvider,
    },
  ],
  exports: [CacheProvider],
})
export class CacheModule {}
