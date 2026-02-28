import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { SearchProvider } from 'src/infra/search/search.provider';
import { SearchProductsRequest } from '../dto/request/search-products.request';
import { SearchProductsUseCase } from './search-products.use-case';

const mockSearch = jest.fn();
const mockClient = { search: mockSearch };

const makeEsResponse = (sources: object[] = [], total = 0) => ({
  hits: {
    hits: sources.map((source, i) => ({
      _source: source,
      sort: ['2024-01-01T00:00:00.000Z', `id-${i}`],
    })),
    total: { value: total || sources.length, relation: 'eq' },
  },
});

const getLastCall = () =>
  (mockSearch.mock.calls as Array<[SearchRequest]>)[
    mockSearch.mock.calls.length - 1
  ][0];

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let searchProvider: jest.Mocked<Pick<SearchProvider, 'getClient'>>;

  beforeEach(() => {
    mockSearch.mockReset();
    searchProvider = { getClient: jest.fn().mockReturnValue(mockClient) };
    useCase = new SearchProductsUseCase(
      searchProvider as unknown as SearchProvider,
    );
  });

  const defaultQuery: SearchProductsRequest = { limit: 10 };

  it('should return data and meta from Elasticsearch response', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([{ name: 'Nike' }]));

    const result = await useCase.execute(defaultQuery);

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({ name: 'Nike' });
    expect(result.meta.limit).toBe(10);
    expect(result.meta.total).toEqual({ value: 1, relation: 'eq' });
  });

  it('should use match_all query when no search term provided', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute(defaultQuery);

    expect(getLastCall().query?.bool?.must).toEqual([{ match_all: {} }]);
  });

  it('should use multi_match query when search term is provided', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({ q: 'nike shoes', limit: 10 });

    expect(getLastCall().query?.bool?.must).toEqual([
      {
        multi_match: {
          query: 'nike shoes',
          fields: ['name', 'description', 'tags'],
        },
      },
    ]);
  });

  it('should add category filter when provided', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({ category: 'shoes', limit: 10 });

    expect(getLastCall().query?.bool?.filter).toEqual(
      expect.arrayContaining([{ term: { category: 'shoes' } }]),
    );
  });

  it('should add price range filter with both min and max', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({ minPrice: 100, maxPrice: 500, limit: 10 });

    expect(getLastCall().query?.bool?.filter).toEqual(
      expect.arrayContaining([{ range: { price: { gte: 100, lte: 500 } } }]),
    );
  });

  it('should add price range filter with only minPrice', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({ minPrice: 100, limit: 10 });

    expect(getLastCall().query?.bool?.filter).toEqual(
      expect.arrayContaining([{ range: { price: { gte: 100 } } }]),
    );
  });

  it('should add tags filter when provided', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({ tags: ['sale', 'new'], limit: 10 });

    expect(getLastCall().query?.bool?.filter).toEqual(
      expect.arrayContaining([{ terms: { tags: ['sale', 'new'] } }]),
    );
  });

  it('should pass search_after to ES when provided', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({
      searchAfter: ['2024-01-01', 'some-id'],
      limit: 10,
    });

    expect(getLastCall().search_after).toEqual(['2024-01-01', 'some-id']);
  });

  it('should return null searchAfter when result has no hits', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    const result = await useCase.execute(defaultQuery);

    expect(result.meta.searchAfter).toBeNull();
  });

  it('should return searchAfter from last hit sort field', async () => {
    mockSearch.mockResolvedValue(
      makeEsResponse([{ name: 'A' }, { name: 'B' }]),
    );

    const result = await useCase.execute(defaultQuery);

    expect(result.meta.searchAfter).toBeDefined();
    expect(Array.isArray(result.meta.searchAfter)).toBe(true);
  });

  it('should respect the size/limit param', async () => {
    mockSearch.mockResolvedValue(makeEsResponse([]));

    await useCase.execute({ limit: 5 });

    expect(getLastCall().size).toBe(5);
  });
});
