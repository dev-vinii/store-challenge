export class PaginatedResponse<T> {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  private constructor(items: T[], page: number, limit: number, total: number) {
    this.items = items
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    }
  }

  static create<T>(
    items: T[],
    page: number,
    limit: number,
    total: number,
  ): PaginatedResponse<T> {
    return new PaginatedResponse(items, page, limit, total)
  }

  static empty<T>(): PaginatedResponse<T> {
    return new PaginatedResponse([], 0, 10, 0)
  }
}
