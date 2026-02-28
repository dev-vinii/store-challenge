import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FindAllSalesResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @Expose()
  productId: string;

  @ApiProperty({ example: 2 })
  @Expose()
  quantity: number;

  @ApiProperty({ example: 49999, description: 'Unit price in cents' })
  @Expose()
  unitPrice: number;

  @ApiProperty({ example: 99998, description: 'Total price in cents' })
  @Expose()
  totalPrice: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;
}
