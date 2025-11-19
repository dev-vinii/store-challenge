import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class BasePaginationDto {
  @ApiPropertyOptional({
    description: 'Items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10

  @ApiPropertyOptional({
    description: 'Created at from last item of the previous page',
  })
  @IsString()
  @IsOptional()
  cursor: string
}
