import { PaginatedResponse } from './pagination.factory';

describe('PaginatedResponse', () => {
  describe('create', () => {
    it('should return data and meta', () => {
      const result = PaginatedResponse.create(['a', 'b'], 10);

      expect(result.data).toEqual(['a', 'b']);
      expect(result.meta).toBeDefined();
    });

    it('should set hasNextPage to false by default', () => {
      const result = PaginatedResponse.create([], 10);

      expect(result.meta.hasNextPage).toBe(false);
    });

    it('should set hasNextPage to true when passed as true', () => {
      const result = PaginatedResponse.create([], 10, null, null, true);

      expect(result.meta.hasNextPage).toBe(true);
    });

    it('should set hasPreviousPage false when cursor is null', () => {
      const result = PaginatedResponse.create([], 10, null);

      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should set hasPreviousPage false when cursor is empty string', () => {
      const result = PaginatedResponse.create([], 10, '');

      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should set hasPreviousPage true when cursor has a value', () => {
      const result = PaginatedResponse.create([], 10, 'some-cursor');

      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should set nextCursor to null by default', () => {
      const result = PaginatedResponse.create([], 10);

      expect(result.meta.nextCursor).toBeNull();
    });

    it('should set nextCursor when provided', () => {
      const result = PaginatedResponse.create([], 10, null, 'next-uuid');

      expect(result.meta.nextCursor).toBe('next-uuid');
    });

    it('should set limit correctly', () => {
      const result = PaginatedResponse.create([], 25);

      expect(result.meta.limit).toBe(25);
    });
  });
});
