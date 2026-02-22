import { IsString, MinLength } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  @MinLength(3)
  name: string;
}
