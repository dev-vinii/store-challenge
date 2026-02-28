import { Queue } from 'src/infra/queue/common/queue.enum';
import { SearchProvider } from 'src/infra/search/search.provider';
import { ProductsProcessor } from './products.processor';
import { productJobBuilder } from './testing/product-job.builder';

const mockIndex = jest.fn();
const mockClient = { index: mockIndex };

describe('ProductsProcessor', () => {
  let processor: ProductsProcessor;
  let searchProvider: jest.Mocked<Pick<SearchProvider, 'getClient'>>;

  beforeEach(() => {
    mockIndex.mockReset();
    searchProvider = { getClient: jest.fn().mockReturnValue(mockClient) };
    processor = new ProductsProcessor(
      searchProvider as unknown as SearchProvider,
    );
  });

  it('should index the product in Elasticsearch with correct index name', async () => {
    mockIndex.mockResolvedValue({});
    const job = productJobBuilder();

    await processor.process(job);

    expect(mockIndex).toHaveBeenCalledWith(
      expect.objectContaining({ index: Queue.PRODUCTS }),
    );
  });

  it('should index using the product id as document id', async () => {
    mockIndex.mockResolvedValue({});
    const job = productJobBuilder();

    await processor.process(job);

    expect(mockIndex).toHaveBeenCalledWith(
      expect.objectContaining({ id: job.data.id }),
    );
  });

  it('should not include id in the indexed document body', async () => {
    mockIndex.mockResolvedValue({});
    const job = productJobBuilder();

    await processor.process(job);

    const [[call]] = mockIndex.mock.calls as Array<[{ document: object }]>;
    expect(call.document).not.toHaveProperty('id');
  });

  it('should include product fields in the document body', async () => {
    mockIndex.mockResolvedValue({});
    const job = productJobBuilder();

    await processor.process(job);

    type IndexCall = {
      document: { name: string; price: number; category: string };
    };
    const [[call]] = mockIndex.mock.calls as Array<[IndexCall]>;
    expect(call.document).toMatchObject({
      name: job.data.name,
      price: job.data.price,
      category: job.data.category,
    });
  });

  it('should propagate errors from Elasticsearch client', async () => {
    mockIndex.mockRejectedValue(new Error('ES error'));
    const job = productJobBuilder();

    await expect(processor.process(job)).rejects.toThrow('ES error');
  });
});
