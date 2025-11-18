import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'

export class CreateProductRequest {
  @ApiProperty({
    description: 'Product name',
    example: 'PlayStation 5',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Product description',
    example:
      'Next-gen gaming console with ultra-high speed SSD and ray tracing',
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    description: 'Product category',
    example: 'gaming',
  })
  @IsString()
  @IsNotEmpty()
  category: string

  @ApiProperty({
    description: 'Product price in cents',
    example: 49999,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number

  @ApiProperty({
    description: 'Available stock quantity',
    example: 25,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  stock: number

  @ApiProperty({
    description: 'Product tags for categorization',
    example: ['gaming', 'console', 'playstation', 'sony'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[]
}
