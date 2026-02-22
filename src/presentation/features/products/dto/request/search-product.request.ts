import { IsOptional, IsString } from 'class-validator';

export class SearchProductRequest {
  @IsString()
  @IsOptional()
  q: string;

  @IsOptional()
  category: number;

  @IsOptional()
  cursor: string;

  @IsOptional()
  limit: number;
}
