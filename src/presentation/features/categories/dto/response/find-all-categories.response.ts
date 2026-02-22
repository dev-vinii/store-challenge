import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FindAllCategoriesResponse {
  @ApiProperty({ example: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Electronics' })
  @Expose()
  name: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
