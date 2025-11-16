import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'

export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  description: string

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  stock: number

  @IsArray()
  @IsString({ each: true })
  tags: string[]
}
