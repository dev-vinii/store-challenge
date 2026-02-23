import { SortCombinations } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { SearchProvider } from 'src/infra/search/search.provider';
import { SearchProductsRequest } from '../dto/request/search-products.request';

@Injectable()
export class SearchProductsUseCase {
  constructor(private readonly searchProvider: SearchProvider) {}

  async execute(query: SearchProductsRequest) {
    const client = this.searchProvider.getClient();

    const must = query.q
      ? [
          {
            multi_match: {
              query: query.q,
              fields: ['name', 'description', 'tags'],
            },
          },
        ]
      : [{ match_all: {} }];

    const filter: object[] = [];

    if (query.category) {
      filter.push({ term: { category: query.category } });
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.push({
        range: {
          price: {
            ...(query.minPrice !== undefined && { gte: query.minPrice }),
            ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
          },
        },
      });
    }

    if (query.tags?.length) {
      filter.push({ terms: { tags: query.tags } });
    }

    const sort: SortCombinations[] = [
      { [query.sort ?? 'createdAt']: { order: 'asc' } },
      { id: { order: 'asc' } },
    ];

    const result = await client.search({
      index: 'products',
      size: query.limit,
      query: { bool: { must, filter } },
      sort,
      ...(query.searchAfter && { search_after: query.searchAfter }),
    });

    const hits = result.hits.hits;
    const lastHit = hits[hits.length - 1];

    return {
      data: hits.map((hit) => hit._source),
      meta: {
        total: result.hits.total,
        limit: query.limit,
        searchAfter: lastHit?.sort ?? null,
      },
    };
  }
}
