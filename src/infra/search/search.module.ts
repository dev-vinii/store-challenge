import { Global, Module } from '@nestjs/common'
import { SearchProvider, searchProvider } from './search.provider'

@Global()
@Module({
  providers: [
    {
      provide: SearchProvider,
      useValue: searchProvider,
    },
  ],
  exports: [SearchProvider],
})
export class SearchModule {}
