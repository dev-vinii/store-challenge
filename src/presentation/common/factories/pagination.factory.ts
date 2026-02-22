import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({
    type: 'object',
    properties: {
      hasNextPage: { type: 'boolean', example: true },
      hasPreviousPage: { type: 'boolean', example: false },
      nextCursor: { type: 'string', nullable: true, example: '123' },
    },
  })
  meta: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    limit: number;
  };

  private constructor(
    items: T[],
    limit: number,
    cursor: string | null,
    nextCursor: string | null = null,
    hasNextPage: boolean = false,
  ) {
    this.data = items;
    this.meta = {
      hasNextPage: hasNextPage,
      hasPreviousPage: cursor !== null && cursor !== '',
      nextCursor,
      limit,
    };
  }

  static create<T>(
    items: T[],
    limit: number,
    currentCursor: string | null = null,
    nextCursor: string | null = null,
    hasNextPage: boolean = false,
  ): PaginatedResponse<T> {
    return new PaginatedResponse(
      items,
      limit,
      currentCursor,
      nextCursor,
      hasNextPage,
    );
  }
}
