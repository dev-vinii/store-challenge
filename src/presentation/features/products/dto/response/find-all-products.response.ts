import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class FindAllProductsResponse {
  @ApiProperty({ example: 'PlayStation 5' })
  @Expose()
  name: string

  @ApiProperty({
    example:
      'Next-gen gaming console with ultra-high speed SSD and ray tracing',
  })
  @Expose()
  description: string

  @ApiProperty({ example: 49999, description: 'Price in cents' })
  @Expose()
  price: number

  @ApiProperty({ example: 25 })
  @Expose()
  stock: number

  @ApiProperty({ example: 'gaming' })
  @Expose()
  category: string

  @ApiProperty({ example: ['gaming', 'console', 'playstation', 'sony'] })
  @Expose()
  tags: string[]
}
