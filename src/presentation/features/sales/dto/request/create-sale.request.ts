import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class CreateSaleRequest {
  @ApiProperty({
    description: 'Product ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of products sold',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
