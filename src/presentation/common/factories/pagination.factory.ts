import { ApiProperty } from '@nestjs/swagger'

export class PaginatedResponse<T> {
  @ApiProperty({ isArray: true })
  items: T[]

  @ApiProperty({
    type: 'object',
    properties: {
      page: { type: 'number', example: 0 },
      limit: { type: 'number', example: 10 },
      total: { type: 'number', example: 100 },
      totalPages: { type: 'number', example: 10 },
    },
  })
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
